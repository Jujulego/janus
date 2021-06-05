import { Manifest } from './manifest';
import { Project } from './project';

// Class
export class Workspace {
  // Constructor
  constructor(readonly project: Project, readonly manifest: Manifest) {}

  // Properties
  get name(): string {
    return this.manifest.name;
  }
}
