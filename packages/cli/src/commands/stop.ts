import { loadJanusConfigFile } from '@jujulego/janus-common';
import { gql } from 'graphql.macro';

import { JanusClient } from '../client';
import { logger } from '../logger';
import { CommandHandler } from '../wrapper';

// Handler
export const command = 'stop';
export const describe = 'Stop the remote proxy server';

export const stopCommand: CommandHandler = async (args) => {
  try {
    // Load config
    logger.spin('Stopping proxy ...');
    const config = await loadJanusConfigFile(args.config, logger);

    // Shutdown
    const client = new JanusClient(config);
    await client.mutation(gql`
      mutation Shutdown {
        shutdown
      }
    `);
    logger.succeed('Proxy stopped');
    return 0;
  } catch (error) {
    logger.fail(error);
    return 1;
  }
};
