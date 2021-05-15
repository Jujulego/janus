import { DynamicModule, Logger, Module } from '@nestjs/common';

import { GatesModule } from './gates/gates.module';

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
          JanusFrontModule.forRoot(GatesModule)
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
