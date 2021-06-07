import { Module } from '@nestjs/common';

import { CommonModule } from '../common.module';

import { ControlService } from './control.service';
import { LoggerTransport } from './logger.transport';
import { ServerResolver } from './server.resolver';

// Module
@Module({
  imports: [
    CommonModule
  ],
  providers: [
    ControlService,
    LoggerTransport,
    ServerResolver
  ]
})
export class ControlModule {}
