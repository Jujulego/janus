import { JanusServer } from '@jujulego/janus-core';

process.env.NODE_ENV = 'production';

// Start server when config is received
process.once('message', async (config: string) => {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown.subscribe(() => process.exit(0));
    server.$started.subscribe(() => process.send?.('started'));

    await server.start(config);
  } catch (error) {
    process.send?.({ name: error.name, message: error.message });
    process.exit(1);
  }
});