import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { ServicesModule } from './services/services.module';

// Module
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),

    ConfigModule,
    ServicesModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
