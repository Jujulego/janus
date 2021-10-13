import { IControlServerConfig, IJanusConfig } from '@jujulego/janus-types';
import { Injectable } from '@nestjs/common';

import { Service } from '../services/service.model';

// Service
@Injectable()
export class ConfigService {
  // Attributes
  private _config: IJanusConfig;

  // Methods
  *services(): Generator<Service> {
    for (const name of Object.keys(this._config.services)) {
      const service = this._config.services[name];

      yield Service.fromConfig(name, service);
    }
  }

  // Properties
  set config(config: IJanusConfig) {
    this._config = config;
  }

  get proxy(): Readonly<IControlServerConfig> {
    return this._config.proxy;
  }

  get control(): Readonly<IControlServerConfig> {
    return this._config.control;
  }
}
