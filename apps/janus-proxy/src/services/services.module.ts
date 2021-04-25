import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';
import { GateResolver } from './gate.resolver';
import { ServiceResolver } from './service.resolver';

// Module
@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    GatesService,
    ResolverService,

    GateResolver,
    ServiceResolver
  ],
  exports: [
    ResolverService
  ]
})
export class ServicesModule {}
