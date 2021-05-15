import { Module } from '@nestjs/common';

import { DataService } from '@jujulego/janus-common';

import { GatesModule } from './gates/gates.module';
import { GatesService } from './gates/gates.service';

// Module
@Module({
  imports: [
    GatesModule
  ],
  providers: [
    { provide: DataService, useExisting: GatesService }
  ],
  exports: [
    DataService
  ]
})
export class PluginModule {}
