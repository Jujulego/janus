import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config/config.module';
import { ControlModule } from './control/control.module';
import { ProxyModule } from './proxy/proxy.module';
import { ServicesModule } from './services/services.module';
import { FrontModule } from './front.module';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.env.NODE_ENV !== 'local' || 'schema.gql',
      installSubscriptionHandlers: true
    }),

    ConfigModule,
    ControlModule,
    FrontModule.forRoot(),
    ProxyModule,
    ServicesModule
  ]
})
export class AppModule {}
