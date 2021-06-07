import { printSchema } from 'graphql';

import { JanusServer } from '@jujulego/janus-proxy';

import { logger } from '../logger';

// Command
export const command = 'gql-schema';
export const describe = 'Prints the control server GraphQL schema';

export async function handler() {
  try {
    logger.spin('Generating schema ...');
    const schema = await JanusServer.generateGQLSchema();
    logger.stop();

    console.log(printSchema(schema));
    process.exit(0);
  } catch (error) {
    logger.fail('Generation failed');
    logger.error(error);
    process.exit(1);
  }
}
