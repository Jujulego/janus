import gql from 'graphql-tag';
import { CommandBuilder } from 'yargs';

import { JanusConfig } from '@jujulego/janus-config';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';
import { JanusClient } from '../client';

// Command
export const command = 'stop';
export const describe = 'Stop the remote proxy server';

export const builder: CommandBuilder = {};

export const handler = commandWrapper(async (args: CommonArgs) => {
  try {
    // Load config
    logger.spin('Stopping proxy ...');
    const config = await JanusConfig.loadFile(args.config);

    // Shutdown
    const client = new JanusClient(config);
    await client.mutation(gql`
      mutation Shutdown {
        shutdown
      }
    `);
    logger.succeed('Proxy stopped');
  } catch (error) {
    logger.fail(error);
    process.exit(1);
  }
});
