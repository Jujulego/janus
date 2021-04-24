import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { GatesService } from './gates.service';
import { ServiceResolver } from './service.resolver';

// Module
@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    GatesService,

    ServiceResolver
  ]
})
export class ServicesModule {}
