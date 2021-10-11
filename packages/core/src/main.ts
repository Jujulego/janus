import { JanusServer } from './server';
import { Logger } from './logger';
import * as process from 'process';

// Bootstrap
(async function () {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown.subscribe(() => process.exit(0));

    // Start server
    const started = await server.start('../../janus.config.yml');

    if (!started) {
      process.exit(1);
    }
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
})();
