import { Module } from '@nestjs/common';

import { PubSubModule } from '../pubsub.module';

import { ControlService } from './control.service';
import { LoggerTransport } from './logger.transport';
import { ServerResolver } from './server.resolver';

// Module
@Module({
  imports: [
    PubSubModule
  ],
  providers: [
    ControlService,
    LoggerTransport,
    ServerResolver
  ]
})
export class ControlModule {}
