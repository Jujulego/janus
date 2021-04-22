import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { ResolverService } from './resolver.service';
import { RoutesService } from './routes.service';

// Module
@Module({
  imports: [ConfigModule],
  providers: [
    ResolverService,
    RoutesService
  ],
  exports: [ResolverService]
})
export class RoutesModule {}
