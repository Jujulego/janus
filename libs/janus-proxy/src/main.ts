import { JanusServer } from './server';

process.env.NODE_ENV = 'development';

// Bootstrap
(async function () {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown.subscribe(() => process.exit(0));

    // Start server
    await server.start('../../janus.config.yml');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
