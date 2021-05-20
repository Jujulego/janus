import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { PluginModule } from '@jujulego/janus-common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FallbackRouteFilter } from './fallback-route.filter';

// Module
@Module({
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: FallbackRouteFilter }
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
