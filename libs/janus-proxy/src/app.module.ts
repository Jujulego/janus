import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config/config.module';
import { ControlModule } from './control/control.module';
import { ProxyModule } from './proxy/proxy.module';
import { ServicesModule } from './services/services.module';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.env.NODE_ENV !== 'local' || 'schema.gql',
    }),

    ConfigModule,
    ControlModule,
    ProxyModule,
    ServicesModule
  ],
})
export class AppModule {}
