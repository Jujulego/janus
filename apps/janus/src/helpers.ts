// Types
export interface CommonArgs {
  config: string;
}

// Methods
export function commandWrapper<A extends CommonArgs>(handler: (args: A) => Promise<void>) {
  return async function (args: A) {
    try {
      await handler(args);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
}
