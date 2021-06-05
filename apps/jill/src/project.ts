import { promises as fs } from 'fs';
import path from 'path';
import glob from 'tiny-glob';

import { Manifest } from './manifest';
import { logger } from './logger';
import { Workspace } from './workspace';

// Class
export class Project {
  // Attributes
  private _mainWorkspace?: Workspace;
  private readonly _workspaces = new Map<string, Workspace>();

  // Constructor
  constructor(private readonly _root: string) {}

  // Methods
  private async _loadManifest(dir: string): Promise<Manifest> {
    const file = path.resolve(this.root, dir, 'package.json');
    logger.debug(`Loading ${file} ...`);

    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data) as Manifest;
  }

  async mainWorkspace(): Promise<Workspace> {
    if (!this._mainWorkspace) {
      const manifest = await this._loadManifest('.');
      this._mainWorkspace = new Workspace(this, manifest);
    }

    return this._mainWorkspace;
  }

  async* workspaces(): AsyncGenerator<Workspace, void, unknown> {
    const main = await this.mainWorkspace();
    yield main;

    // Load child workspaces
    const { workspaces = [] } = main.manifest;

    for (const pattern of workspaces) {
      for (const dir of await glob(pattern, { cwd: this.root })) {
        let ws = this._workspaces.get(dir);

        if (!ws) {
          const manifest = await this._loadManifest(dir);
          ws = new Workspace(this, manifest);

          this._workspaces.set(dir, ws);
        }

        yield ws;
      }
    }
  }

  // Properties
  get root(): string {
    return path.resolve(this._root);
  }
}
