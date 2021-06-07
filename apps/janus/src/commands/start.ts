import { CommandBuilder } from 'yargs';

import { JanusServer } from '@jujulego/janus-proxy';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';

// Command
export const command = 'start';
export const aliases = ['$0'];
export const describe = 'Starts the proxy server';

export const builder: CommandBuilder = {};

export const handler = commandWrapper(async (args: CommonArgs) => {
  try {
    // Create server
    logger.spin('Starting proxy ...');
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown.subscribe(() => process.exit(0));
    logger.stop();

    // Start server
    await server.start(args.config);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});
