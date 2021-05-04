import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ServicesModule } from '../services/services.module';

import { ProxyServer } from './proxy.server';

// Module
@Module({
  imports: [
    ConfigModule,
    ServicesModule
  ],
  providers: [ProxyServer]
})
export class ProxyModule {}
