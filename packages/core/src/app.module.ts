import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config';
import { ControlModule } from './control/control.module';
import { ServicesModule } from './services/services.module';
import { ProxyModule } from './proxy/proxy.module';

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
