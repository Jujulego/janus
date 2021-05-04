import { gql, GraphQLClient } from 'graphql-request';
import { CommandBuilder } from 'yargs';

import { DEFAULT_CONTROL_PORT, JanusServer } from '@jujulego/janus-proxy';

import { commandWrapper, CommonArgs } from '../helpers';

// Command
export const command = 'stop';
export const describe = 'Stop the remote proxy server';

export const builder: CommandBuilder = {};

export const handler = commandWrapper(async (args: CommonArgs) => {
  try {
    // Load config
    const config = await JanusServer.loadConfigFile(args.config);

    // Shutdown
    const client = new GraphQLClient(`http://localhost:${config.control?.port || DEFAULT_CONTROL_PORT}/graphql`)
    await client.request(gql`
      mutation Shutdown {
          shutdown
      }
    `);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
