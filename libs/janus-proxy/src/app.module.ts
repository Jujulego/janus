import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config/config.module';
import { ControlModule } from './control/control.module';
import { FrontModule } from './front.module';
import { GatesModule } from './gates/gates.module';
import { GraphQLInterceptor } from './graphql.interceptor';
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
    FrontModule.forRoot(),
    ProxyModule,
    GatesModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: GraphQLInterceptor }],
})
export class AppModule {}
