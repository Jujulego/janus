import { Module } from '@nestjs/common';

import { ProxyServer } from './proxy.server';

// Module
@Module({
  providers: [ProxyServer]
})
export class ProxyModule {}
