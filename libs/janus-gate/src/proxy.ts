import { IJanusConfig, JanusConfig } from '@jujulego/janus-config';
import { JanusServer } from '@jujulego/janus-proxy';

// Bootstrap
(async () => {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown
      .subscribe(() => process.exit(0));

    server.$started
      .subscribe(() => process.send?.('started'))

    // Start server
    process.once('message', async (config: IJanusConfig) => {
      await server.start(new JanusConfig(config));
    });
  } catch (error) {
    process.send?.(error);
    process.exit(1);
  }
})();
