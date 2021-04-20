import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from './config/config.module';
import { ProxyModule } from './proxy/proxy.module';

// Module
@Module({
  imports: [
    ConfigModule,
    ProxyModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
