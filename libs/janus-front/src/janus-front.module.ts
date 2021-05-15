import { DynamicModule, Module } from '@nestjs/common';

import { PluginModule } from '@jujulego/janus-common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Module
@Module({
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ]
})
export class JanusFrontModule extends PluginModule {
  // Statics
  static forRoot(DataModule: any): DynamicModule {
    return {
      module: JanusFrontModule,
      imports: [
        DataModule
      ]
    };
  }
}
