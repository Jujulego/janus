import { printSchema } from 'graphql';

import { JanusServer } from '@jujulego/janus-proxy';

// Command
export const command = 'gql-schema';
export const describe = 'Prints the control server GraphQL schema';

export async function handler() {
  try {
    const schema = await JanusServer.generateGQLSchema();

    console.log(printSchema(schema));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
