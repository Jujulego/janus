import Ajv from 'ajv';
import { promises as pfs } from 'fs';
import path from 'path';
import yaml from 'yaml';

import {
  ConsoleLogger,
  IControlServerConfig,
  IJanusConfig,
  ILogger,
  IProxyConfig,
  IServiceConfig
} from '@jujulego/janus-types';
import configSchema from '../config.schema.json';

// Constants
export const DEFAULT_CONTROL_PORT = 5000;
export const DEFAULT_PROXY_PORT = 3000;

// Types
interface ILoadedJanusConfig {
  // Attributes
  pidfile: string;
  proxy?: IProxyConfig;
  control?: IControlServerConfig;
  services: Record<string, IServiceConfig>;
}

// Utils
async function handleIOError<R>(fun: () => Promise<R>, file: string, logger: ILogger): Promise<R> {
  try {
    return await fun();
  } catch (error) {
    logger.error('Failed to load config file');

    if (error.code === 'ENOENT') {
      throw new Error(`File ${file} does not exists`);
    }

    throw error;
  }
}

export async function loadJanusConfigFile(file: string, logger: ILogger = new ConsoleLogger()): Promise<IJanusConfig> {
  // Check if is file
  const stat = await handleIOError(() => pfs.stat(file), file, logger);

  if (!stat.isFile()) {
    logger.error('Failed to load config file');
    throw new Error(`File ${file} does not exists or is not a file`);
  }

  // Read file
  const str = await handleIOError(() => pfs.readFile(file, 'utf-8'), file, logger);
  const data = yaml.parse(str);

  // Validate file
  const ajv = new Ajv({ allErrors: true, useDefaults: true });
  const validate = ajv.compile<ILoadedJanusConfig>(configSchema);

  if (!validate(data)) {
    if (validate.errors) {
      logger.error('Errors in config file:');

      for (const err of validate.errors) {
        logger.error(`- ${err.instancePath} ${err.message}`);
      }
    }

    throw new Error(`Invalid config file ${file}`);
  }

  // Processing and defaults
  const config: IJanusConfig = {
    ...data,
    pidfile: path.resolve(path.dirname(file), data.pidfile),
    control: data.control ?? { port: DEFAULT_CONTROL_PORT },
    proxy: data.proxy ?? { port: DEFAULT_PROXY_PORT },
  };

  logger.verbose(`Config file ${file} loaded`);
  logger.debug(`Config loaded: ${JSON.stringify(config, null, 2)}`);

  return config;
}