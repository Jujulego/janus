import { DynamicModule, Type, Injectable } from '@nestjs/common';

import { IService } from './service';

// Service
@Injectable()
export abstract class DataService {
  // Methods
  abstract listServices(): IService[];
}

// Module
export abstract class PluginModule {
  // Statics
  static forRoot(DataModule: Type): DynamicModule {
    throw Error('Not implemented !');
  }
}
