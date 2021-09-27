import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config';
// import { ControlModule } from './control/control.module';
// import { FrontModule } from './front.module';
// import { GatesModule } from './gates/gates.module';
// import { ProxyModule } from './proxy/proxy.module';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.env.NODE_ENV !== 'development' || 'schema.gql',
      installSubscriptionHandlers: true,
    }),

    ConfigModule,
    // ControlModule,
    // FrontModule.forRoot(),
    // ProxyModule,
    // GatesModule,
  ],
})
export class AppModule {}
