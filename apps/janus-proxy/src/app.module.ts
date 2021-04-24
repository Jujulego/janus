import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from './config/config.module';
import { ServicesModule } from './services/services.module';

// Module
@Module({
  imports: [
    ConfigModule,
    ServicesModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
