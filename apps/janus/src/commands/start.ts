import { CommandBuilder } from 'yargs';

import { JanusServer } from '@jujulego/janus-proxy';

import { commandWrapper, CommonArgs } from '../helpers';

// Command
export const command = 'start';
export const aliases = ['$0'];
export const describe = 'Starts the proxy server';

export const builder: CommandBuilder = {};

export const handler = commandWrapper(async (args: CommonArgs) => {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown.subscribe(() => process.exit(0));

    // Start server
    await server.start(args.config);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
