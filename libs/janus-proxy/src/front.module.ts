import { DynamicModule, Logger, Module } from '@nestjs/common';

// Module
@Module({})
export class FrontModule {
  // Methods
  static forRoot(): DynamicModule {
    try {
      const { JanusFrontModule } = require('@jujulego/janus-front');

      return {
        module: FrontModule,
        imports: [JanusFrontModule]
      };
    } catch (error) {
      Logger.log('Front library invalid or not found. Front will not be served');
      Logger.debug(error);

      return {
        module: FrontModule
      };
    }
  }
}
