import { logger, LoggerOptions } from './logger';

// Types
export interface CommonArgs extends LoggerOptions {
  verbose: boolean;
  _: (string | number)[];
  '$0': string;
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
