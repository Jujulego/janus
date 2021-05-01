import { Module } from '@nestjs/common';

import { ServerService } from './server.service';
import { ServerResolver } from './server.resolver';

// Module
@Module({
  providers: [
    ServerService,
    ServerResolver
  ]
})
export class ControlModule {}
