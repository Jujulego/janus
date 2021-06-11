import * as cp from 'child_process';
import * as path from 'path';

import { logger } from './logger';
import * as Buffer from 'buffer';

// Types
export interface SpawnOptions {
  cwd?: string;
  location?: string;
  env?: Partial<Record<string, string>>
}

// Utils
export function spawn(cmd: string, args: string[], opts: SpawnOptions = {}): Promise<void> {
  // Options
  const cwd = opts.cwd || process.cwd();
  const location = opts.location || path.relative(cwd, process.cwd());

  // Spawn
  return new Promise<void>((resolve, reject) => {
    logger.verbose(`${[cmd, ...args].join(' ')} (in ${location})`);

    const run = cp.spawn(cmd, args, {
      cwd,
      shell: true,
      stdio: logger.isSpinning ? 'pipe' : 'inherit',
      env: {
        FORCE_COLOR: '1',
        ...process.env,
        ...opts.env
      }
    });

    run.stdout?.on('data', (data: Buffer) => {
      logger.info(data.toString('utf-8'));
    });

    run.stderr?.on('data', (data: Buffer) => {
      logger.warn(data.toString('utf-8'));
    });

    run.on('close', (code) => {
      if (code) {
        reject(new Error(`Script failed with error code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
