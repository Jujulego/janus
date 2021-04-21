import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { RoutesModule } from '../routes/routes.module';

import { ProxyServer } from './proxy.server';

// Module
@Module({
  imports: [
    ConfigModule,
    RoutesModule
  ],
  providers: [ProxyServer]
})
export class ProxyModule {}
