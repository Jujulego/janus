import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';

import { Manifest } from './manifest';
import { Project } from './project';
import { logger } from './logger';
import { formatDuration } from './utils';

// Class
export class Workspace {
  // Constructor
  constructor(
    private readonly _cwd: string,
    readonly manifest: Manifest,
    readonly project: Project
  ) {}

  // Methods
  async* dependencies(): AsyncGenerator<Workspace, void, unknown> {
    if (!this.manifest.dependencies) return;

    for (const dep of Object.keys(this.manifest.dependencies)) {
      const ws = await this.project.workspace(dep);

      if (ws) {
        yield ws;
      }
    }
  }

  async* devDependencies(): AsyncGenerator<Workspace, void, unknown> {
    if (!this.manifest.devDependencies) return;

    for (const dep of Object.keys(this.manifest.devDependencies)) {
      const ws = await this.project.workspace(dep);

      if (ws) {
        yield ws;
      }
    }
  }

  run(script: string, ...args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      logger.debug(`${this.printName}: yarn run ${script} ${args.join(' ')} (in ${this.cwd})`);
      const run = spawn('yarn', ['run', script, ...args], { cwd: this.cwd, shell: true, stdio: 'pipe' });

      run.stdout.on('data', (data: Buffer) => {
        logger.info(data.toString('utf-8'));
      });

      run.stderr.on('data', (data: Buffer) => {
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

  async build(): Promise<void> {
    const start = Date.now();
    await this.run('build');

    logger.succeed(chalk`${this.printName} built {grey (${formatDuration(Date.now() - start)})}`);
  }

  // Properties
  get name(): string {
    return this.manifest.name;
  }

  get cwd(): string {
    return path.resolve(this.project.root, this._cwd);
  }

  get printName(): string {
    return chalk.bold(this.name);
  }
}
