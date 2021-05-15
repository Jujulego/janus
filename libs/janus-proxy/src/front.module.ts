import { DynamicModule, Logger, Module } from '@nestjs/common';

import { PluginModule } from './plugin.module';

// Module
@Module({})
export class FrontModule {
  // Methods
  static async forRoot(): Promise<DynamicModule> {
    try {
      const { default: JanusFrontModule } = await import('@jujulego/janus-front');

      return {
        module: FrontModule,
        imports: [
          JanusFrontModule.forRoot(PluginModule)
        ]
      };
    } catch (error) {
      Logger.log('Front library not found. Front will not be served');
      Logger.debug(error);

      return {
        module: FrontModule
      };
    }
  }
}
