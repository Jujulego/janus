import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { CommonModule } from '../common.module';

import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';
import { GateResolver } from './gate.resolver';
import { ServiceResolver } from './service.resolver';

// Module
@Module({
  imports: [
    ConfigModule,
    CommonModule
  ],
  providers: [
    GatesService,
    ResolverService,

    GateResolver,
    ServiceResolver
  ],
  exports: [
    GatesService,
    ResolverService
  ],
})
export class ServicesModule {}
