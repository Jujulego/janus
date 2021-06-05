// Types
export interface Manifest {
  name: string;
  version?: string;
  private?: boolean;
  workspaces?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
