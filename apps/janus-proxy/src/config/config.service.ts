import { Injectable, Logger } from '@nestjs/common';
import Ajv from 'ajv';
import fs from 'fs/promises';
import yaml from 'yaml';

import { Config } from '../janus-config';
import configSchema from '../janus-config.schema.json';
import { Service } from '../services/service.model';

// Service
@Injectable()
export class ConfigService {
  // Attributes
  private readonly _logger = new Logger(ConfigService.name);
  private _config: Config;

  // Methods
  async load(filename: string): Promise<void> {
    try {
      // Check if is file
      const stat = await fs.stat(filename);

      if (!stat.isFile()) {
        throw new Error(`File ${filename} does not exists or is not a file`);
      }

      // Read file
      const str = await fs.readFile(filename, 'utf-8');
      const data = yaml.parse(str) as Config;

      // Validate file
      const ajv = new Ajv({ allErrors: true, useDefaults: true, logger: this._logger });
      const validate = ajv.compile(configSchema);

      if (!validate(data)) {
        if (validate.errors) {
          this._logger.error('Errors in config file:');

          for (const err of validate.errors) {
            this._logger.error(`- ${err.instancePath} ${err.message}`);
          }
        }

        throw new Error(`Invalid config file ${filename}`)
      }

      this._config = data;
      this._logger.log(`Config file ${filename} loaded`);

    } catch (error) {
      this._logger.error('Failed to load config file');

      if (error.code === 'ENOENT') {
        throw new Error(`File ${filename} does not exists`);
      }

      throw error;
    }
  }

  *services(): Generator<Service> {
    for (const name of Object.keys(this._config.services)) {
      const service = this._config.services[name];

      yield Service.fromConfig(name, service);
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
