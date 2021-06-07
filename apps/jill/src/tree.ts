import { Workspace } from './workspace';

// Types
type DepsExtractor = (ws: Workspace) => AsyncGenerator<Workspace, void, unknown>;

// Utils
async function* walk(ws: Workspace, emitted: Set<string>, extractor: DepsExtractor): AsyncGenerator<Workspace, void, unknown> {
  for await (const dep of extractor(ws)) {
    yield* walk(dep, emitted, extractor);

    if (!emitted.has(dep.name)) {
      emitted.add(dep.name);

      yield dep;
    }
  }
}

export async function* walkDependencies(ws: Workspace): AsyncGenerator<Workspace, void, unknown> {
  yield* walk(ws, new Set(), (ws) => ws.dependencies());
}

export function walkDevDependencies(ws: Workspace): AsyncGenerator<Workspace, void, unknown> {
  return walk(ws, new Set(), async function* (ws) {
    yield* ws.dependencies();
    yield* ws.devDependencies();
  });
}
