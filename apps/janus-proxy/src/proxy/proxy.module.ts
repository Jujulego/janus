import { Module } from '@nestjs/common';

import { ProxyServer } from './proxy.server';
import { ConfigModule } from '../config/config.module';

// Module
@Module({
  imports: [ConfigModule],
  providers: [ProxyServer]
})
export class ProxyModule {}
