import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { PubSubModule } from '../pubsub.module';

import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';
import { GateResolver } from './gate.resolver';
import { ServiceResolver } from './service.resolver';

// Module
@Module({
  imports: [ConfigModule, PubSubModule],
  providers: [GatesService, ResolverService, GateResolver, ServiceResolver],
  exports: [GatesService, ResolverService],
})
export class GatesModule {}
