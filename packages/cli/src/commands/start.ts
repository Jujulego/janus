import { ILog } from '@jujulego/janus-types';
import { fork } from 'child_process';
import path from 'path';

import { logger } from '../logger';
import { CommandHandler } from '../wrapper';

// Types
interface StartArgs {
  daemon: boolean;
}

// Handler
export const startCommand: CommandHandler<StartArgs> = async (args) => {
  try {
    logger.spin('Starting proxy ...');

    // Fork process
    const child = fork(path.resolve(__dirname, '../proxy'), [], {
      cwd: process.cwd(),
      detached: args.daemon,
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    });

    // Transmit to logger
    child.stdout?.on('data', (msg: Buffer) => {
      for (const line of msg.toString('utf-8').split('\n')) {
        if (!line) continue;

        const { level, message, ...meta } = JSON.parse(line) as ILog;
        logger.log(level, message, meta);
      }
    });

    child.stderr?.on('data', (msg: Buffer) => {
      logger.error(msg.toString('utf-8'));
    });

    // Handle messages
    return new Promise<number>((resolve) => {
      child.on('message', (msg: 'started' | Error) => {
        if (msg === 'started') {
          logger.succeed('Proxy started');

          if (args.daemon) {
            resolve(0);
          }
        } else {
          logger.fail(msg.message);
        }
      });

      child.on('close', (code) => {
        logger.stop();
        resolve(code || 0);
      });

      child.send(args.config);
    });
  } catch (error) {
    logger.error(error);
    return 1;
  }
};
