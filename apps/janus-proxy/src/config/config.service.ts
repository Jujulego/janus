import { Injectable, Logger } from '@nestjs/common';
import Ajv from 'ajv';
import fs from 'fs/promises';
import yaml from 'yaml';

import { JanusConfig, JanusService, JanusServiceWithName } from './janus-config';
import configSchema from '../janus-config.schema.json';

// Setup
const ajv = new Ajv();

// Service
@Injectable()
export class ConfigService {
  // Attributes
  private readonly _logger = new Logger(ConfigService.name);
  private _config: JanusConfig;

  // Methods
  async load(filename: string): Promise<void> {
    // Read file
    const str = await fs.readFile(filename, 'utf-8');
    const data = yaml.parse(str) as JanusConfig;

    // Validate file
    const validate = ajv.compile(configSchema);

    if (!validate(data)) {
      throw new Error('Invalid config file');
    }

    this._config = data;
    this._logger.log('Configuration file loaded');
  }

  *services(): Generator<JanusServiceWithName> {
    for (const name of Object.keys(this._config.services)) {
      const service = this._config.services[name];

      yield {
        name,
        url: service.url,
        target: service.target
      };
    }
  }

  // Properties
  get proxy() {
    return {
      port: this._config.proxy?.port || 3000
    };
  }

  get server() {
    return {
      port: this._config.server?.port || 5000
    };
  }
}
