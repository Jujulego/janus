import { logger, LoggerOptions } from './logger';
import { Arguments } from 'yargs';

// Types
export interface CommonArgs extends Arguments, LoggerOptions {
  verbose: boolean;
  '--'?: string[];
}

// Methods
export function commandWrapper<A extends CommonArgs>(handler: (args: A) => Promise<void>) {
  return async function (args: A) {
    // Set logger level
    if (args.verbose) args.verbosity = 'verbose';
    logger.setOptions({ verbosity: args.verbosity });

    // Run command
    try {
      await handler(args);
    } catch (error) {
      logger.fail(error);
      process.exit(1);
    }
  };
}
