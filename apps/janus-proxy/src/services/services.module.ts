import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';
import { ServiceResolver } from './service.resolver';

// Module
@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    GatesService,
    ResolverService,

    ServiceResolver
  ]
})
export class ServicesModule {}
