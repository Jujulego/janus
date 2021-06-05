import chalk from 'chalk';

import { Manifest } from './manifest';
import { Project } from './project';

// Class
export class Workspace {
  // Constructor
  constructor(readonly project: Project, readonly manifest: Manifest) {}

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

  // Properties
  get name(): string {
    return this.manifest.name;
  }

  get printName(): string {
    return chalk.bold(this.name);
  }
}
