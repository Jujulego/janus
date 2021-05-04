import { Injectable } from '@nestjs/common';

import { DEFAULT_CONTROL_PORT, DEFAULT_PROXY_PORT, JanusConfig } from '../janus-config';
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
    return {
      port: this._config.proxy?.port || DEFAULT_PROXY_PORT
    };
  }

  get control() {
    return {
      port: this._config.control?.port || DEFAULT_CONTROL_PORT
    };
  }
}
