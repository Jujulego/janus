// Methods
export function commandWrapper<A extends object>(handler: (args: A) => Promise<void>) {
  return async function(args: A) {
    try {
      await handler(args);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
