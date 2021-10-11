import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

import { ConfigModule } from './config';
import { ControlModule } from './control';
import { Logger } from './logger';
import { ServicesModule } from './services';
import { ProxyModule } from './proxy';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.env.NODE_ENV !== 'development' || 'schema.gql',
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    ServeStaticModule.forRootAsync({ useFactory: async () => {
      const logger = new Logger('JanusServer');

      try {
        return [{
          rootPath: path.dirname(require.resolve('@jujulego/janus-front'))
        }];
      } catch (error) {
        logger.warn('Unable to load @jujulego/janus-front package, gui will not be served.');
        logger.debug(error);

        return [];
      }
    } }),

    ConfigModule,
    ControlModule,
    ProxyModule,
    ServicesModule
  ],
})
export class AppModule {}
