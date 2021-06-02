import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { GatesModule } from '../gates/gates.module';

import { ProxyServer } from './proxy.server';

// Module
@Module({
  imports: [ConfigModule, GatesModule],
  providers: [ProxyServer],
})
export class ProxyModule {}
