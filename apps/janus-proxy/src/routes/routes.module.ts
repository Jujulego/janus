import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { RoutesService } from './routes.service';

// Module
@Module({
  imports: [ConfigModule],
  providers: [RoutesService],
  exports: [RoutesService]
})
export class RoutesModule {}
