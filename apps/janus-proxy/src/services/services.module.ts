import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { GatesService } from './gates.service';

// Module
@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    GatesService
  ]
})
export class ServicesModule {}
