import { Module } from '@nestjs/common';

import { ControlService } from './control.service';
import { ServerResolver } from './server.resolver';

// Module
@Module({
  providers: [
    ControlService,
    ServerResolver
  ]
})
export class ControlModule {}
