import { CommandBuilder } from 'yargs';

import { JanusServer } from '../server';

// Types
export interface StartArgs {
  config: string;
}

// Command
export const command = 'start';
export const aliases = ['$0'];
export const describe = 'Starts the proxy server';

export const builder: CommandBuilder = {
  config: {
    alias: 'c',
    type: 'string',
    description: 'Path to the configuration file',
    default: 'janus.config.yml'
  }
};

export async function handler(args: StartArgs) {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown
      .subscribe(() => process.exit(0))

    // Start server
    await server.start(args.config);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
