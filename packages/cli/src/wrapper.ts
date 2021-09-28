import type { Arguments } from 'yargs';

import { logger } from './logger';

// Types
export interface CommonArgs {
  config: string;
  verbose: number;
}

export type CommandHandler<A = Record<string, unknown>> = (argv: Arguments<A & CommonArgs>) => Promise<number | void>

// Wrapper
export function commandHandler<A = Record<string, never>>(handler: CommandHandler<A>) {
  return async function (argv: Arguments<A & CommonArgs>): Promise<void> {
    // Setup
    if (argv.verbose === 1) {
      logger.level = 'verbose';
    } else if (argv.verbose >= 2) {
      logger.level = 'debug';
    }

    // Run command
    try {
      process.exit(await handler(argv) || 0);
    } catch (error) {
      logger.fail(error);
      process.exit(1);
    }
  };
}
