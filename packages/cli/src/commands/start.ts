import { JanusServer } from '@jujulego/janus-core';
import { fork } from 'child_process';
import path from 'path';
import { firstValueFrom, map } from 'rxjs';

import { logger } from '../logger';
import { CommandHandler } from '../wrapper';

// Types
interface StartArgs {
  daemon: boolean;
}

// Handler
export const startCommand: CommandHandler<StartArgs> = async (args) => {
  try {
    // Create server
    logger.spin('Starting proxy ...');
    const server = await JanusServer.createServer();
    logger.stop();

    // Start server
    if (args.daemon) {
      const child = fork(path.resolve(__dirname, '../proxy.js'), [], {
        cwd: process.cwd(),
        detached: true,
        stdio: 'ignore',
      });

      return new Promise<number>((resolve) => {
        child.on('message', (msg: 'started' | Error) => {
          if (msg === 'started') {
            resolve(0);
          } else {
            logger.error(msg.message);
            resolve(1);
          }
        });

        child.send(args.config);
      });
    } else {
      if (await server.start(args.config)) {
        return firstValueFrom(server.$shutdown.pipe(map(() => 0)));
      } else {
        return 1;
      }
    }
  } catch (error) {
    logger.error(error);
    return 1;
  }
};
