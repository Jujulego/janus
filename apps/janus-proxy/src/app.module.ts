import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ProxyModule } from './proxy/proxy.module';

// Module
@Module({
  imports: [ProxyModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
