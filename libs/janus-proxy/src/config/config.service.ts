import { Injectable } from '@nestjs/common';

import { JanusConfig } from '@jujulego/janus-config';

import { Service } from '../services/service.model';

// Service
@Injectable()
export class ConfigService {
  // Attributes
  private _config: JanusConfig;

  // Methods
  *services(): Generator<Service> {
    for (const name of Object.keys(this._config.services)) {
      const service = this._config.services[name];

      yield Service.fromConfig(name, service);
    }
  }

  // Properties
  set config(config: JanusConfig) {
    this._config = config;
  }

  get proxy() {
    return this._config.proxy;
  }

  get control() {
    return this._config.control;
  }
}
