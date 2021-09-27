import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { ServicesModule } from '../services';

import { ProxyServer } from './proxy.server';

// Module
@Module({
  imports: [ConfigModule, ServicesModule],
  providers: [ProxyServer],
})
export class ProxyModule {}
