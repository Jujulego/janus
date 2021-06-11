import chalk from 'chalk';
import path from 'path';

import { Manifest } from './manifest';
import { Project } from './project';
import { logger } from './logger';
import { formatDuration } from './utils';
import { spawn } from './spawn';

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

  async run(script: string, ...args: string[]): Promise<void> {
    if (this.manifest.scripts && this.manifest.scripts[`jill:${script}`]) {
      script = `jill:${script}`;
    }

    return await spawn('yarn', [script, ...args], {
      cwd: this.cwd,
      location: this.printName,
      env: {
        JILL_STARTED_SCRIPT: script,
      }
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
