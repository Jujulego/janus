import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { printSchema } from 'graphql';

import { GateResolver } from '../services/gate.resolver';
import { ServiceResolver } from '../services/service.resolver';

// Command
export const command = 'gql-schema';
export const description = 'Prints the control server GraphQL schema';

export async function handler() {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: false });
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(
    [GateResolver, ServiceResolver]
  );

  console.log(printSchema(schema));
}
