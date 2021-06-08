// Constants
const TIME_UNITS: [string, number][] = [
  ['h', 3600000],
  ['m', 60000],
  ['s', 1000]
];

// Utils
export function formatDuration(ms: number): string {
  const txt: string[] = [];

  for (const [unit, factor] of TIME_UNITS) {
    const v = Math.floor(ms / factor);

    if (v > 0) {
      txt.push(`${v}${unit}`);
      ms = ms % factor;
    }
  }

  return txt.join(' ');
}

export async function* combine<T>(...generators: AsyncGenerator<T>[]): AsyncGenerator<T> {
  for (const gen of generators) {
    yield* gen;
  }
}
