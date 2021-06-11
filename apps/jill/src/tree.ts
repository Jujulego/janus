import { Workspace } from './workspace';
import { combine } from './utils';

// Types
type DepsExtractor = (ws: Workspace) => AsyncGenerator<Workspace>;

// Extractors
export const extractors = {
  dependencies: <DepsExtractor>((ws) => ws.dependencies()),
  devDependencies: <DepsExtractor>((ws) => combine(ws.dependencies(), ws.devDependencies())),
};

// Walkers
async function* _walk(ws: Workspace, emitted: Set<string>, extractor: DepsExtractor): AsyncGenerator<Workspace> {
  for await (const dep of extractor(ws)) {
    yield* _walk(dep, emitted, extractor);

    if (!emitted.has(dep.name)) {
      emitted.add(dep.name);

      yield dep;
    }
  }
}

export function walk(ws: Workspace, extractor: DepsExtractor): AsyncGenerator<Workspace> {
  return _walk(ws, new Set(), extractor);
}
