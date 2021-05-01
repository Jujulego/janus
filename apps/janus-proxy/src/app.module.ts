import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from './config/config.module';
import { ProxyModule } from './proxy/proxy.module';
import { ServicesModule } from './services/services.module';
import { ServerService } from './server.service';
import { ServerResolver } from './server.resolver';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),

    ConfigModule,
    ProxyModule,
    ServicesModule
  ],
  providers: [
    ServerService,
    ServerResolver
  ],
})
export class AppModule {}
