import Ajv from 'ajv';
import fs from 'fs/promises';
import yaml from 'yaml';

import { IJanusConfig } from './janus-config.model';
import janusConfigSchema from './janus-config.schema.json';

// Constants
export const DEFAULT_CONTROL_PORT = 5000;
export const DEFAULT_PROXY_PORT = 3000;

// Types
export interface ILogger {
  // Methods
  log(message: string): void;
  error(message: string): void;
}

export interface IOptions {
  // Options
  logger?: ILogger;
}

// Class
export class JanusConfig implements IJanusConfig {
  // Constructor
  constructor(
    readonly config: IJanusConfig
  ) {}

  // Statics
  static async loadFile(file: string, options?: IOptions): Promise<JanusConfig> {
    // Options
    const logger = options?.logger ?? console;

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
      const validate = ajv.compile(janusConfigSchema);

      if (!validate(data)) {
        if (validate.errors) {
          logger.error('Errors in config file:');

          for (const err of validate.errors) {
            logger.error(`- ${err.instancePath} ${err.message}`);
          }
        }

        throw new Error(`Invalid config file ${file}`);
      }

      logger.log(`Config file ${file} loaded`);
      return new JanusConfig(data);
    } catch (error) {
      logger.error('Failed to load config file');

      if (error.code === 'ENOENT') {
        throw new Error(`File ${file} does not exists`);
      }

      throw error;
    }
  }

  // Properties
  get control() {
    return {
      port: this.config.control?.port || DEFAULT_CONTROL_PORT,
    };
  }

  get proxy() {
    return {
      port: this.config.proxy?.port || DEFAULT_PROXY_PORT,
    };
  }

  get services() {
    return this.config.services;
  }
}