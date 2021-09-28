import { printSchema } from 'graphql';

import { JanusServer } from '@jujulego/janus-core';

import { logger } from '../logger';
import { CommandHandler } from '../wrapper';

// Handler
export const gqlSchemaCommand: CommandHandler = async () => {
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
};
