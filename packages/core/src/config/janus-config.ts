import Ajv from 'ajv';
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';

import configSchema from '@jujulego/janus-types/dist/config.schema.json';
import { IControlServerConfig, IJanusConfig, IServiceConfig } from '@jujulego/janus-types';
import { Logger } from '../logger';

// Constants
export const DEFAULT_CONTROL_PORT = 5000;
export const DEFAULT_PROXY_PORT = 3000;

// Class
export class JanusConfig implements IJanusConfig {
  // Constructor
  constructor(
    readonly config: IJanusConfig
  ) {}

  // Statics
  static async loadFile(file: string): Promise<JanusConfig> {
    // Options
    const logger = new Logger('JanusConfig');

    try {
      // Check if is file
      const stat = await fs.stat(file);

      if (!stat.isFile()) {
        throw new Error(`File ${file} does not exists or is not a file`);
      }

      // Read file
      const str = await fs.readFile(file, 'utf-8');
      const data = yaml.parse(str) as IJanusConfig;

      // Validate file
      const ajv = new Ajv({ allErrors: true, useDefaults: true });
      const validate = ajv.compile(configSchema);

      if (!validate(data)) {
        if (validate.errors) {
          logger.error('Errors in config file:');

          for (const err of validate.errors) {
            logger.error(`- ${err.instancePath} ${err.message}`);
          }
        }

        throw new Error(`Invalid config file ${file}`);
      }

      // Update file paths
      data.pidfile = path.resolve(path.dirname(file), data.pidfile);

      const config = new JanusConfig(data);
      logger.verbose(`Config file ${file} loaded`);
      logger.debug(`Config loaded: ${JSON.stringify(config.config, null, 2)}`);

      return config;
    } catch (error) {
      logger.error('Failed to load config file');

      if (error.code === 'ENOENT') {
        throw new Error(`File ${file} does not exists`);
      }

      throw error;
    }
  }

  // Properties
  get pidfile(): string {
    return this.config.pidfile;
  }

  get control(): Readonly<Required<IControlServerConfig>> {
    return {
      port: this.config.control?.port || DEFAULT_CONTROL_PORT,
    };
  }

  get proxy(): Readonly<Required<IControlServerConfig>> {
    return {
      port: this.config.proxy?.port || DEFAULT_PROXY_PORT,
    };
  }

  get services(): Readonly<Record<string, IServiceConfig>> {
    return this.config.services;
  }
}
