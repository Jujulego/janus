import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config';
import { ControlModule } from './control';
import { ServicesModule } from './services';
import { ProxyModule } from './proxy';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.env.NODE_ENV !== 'development' || 'schema.gql',
      installSubscriptionHandlers: true,
    }),

    ConfigModule,
    ControlModule,
    ProxyModule,
    ServicesModule,
  ],
})
export class AppModule {}
