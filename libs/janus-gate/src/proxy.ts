import { IJanusConfig, JanusConfig } from '@jujulego/janus-config';

// Utils
async function importProxy() {
  try {
    return await import('@jujulego/janus-proxy');
  } catch (error) {
    throw new Error(
      '@jujulego/janus-proxy is needed for autostart.\n' +
      'Please install it:\n' +
      '  npm install --save-dev @jujulego/janus-proxy\n' +
      'or\n' +
      '  yarn add --dev @jujulego/janus-proxy'
    );
  }
}

// Start server when config is received
process.once('message', async (config: IJanusConfig) => {
  try {
    // Import proxy
    const { JanusServer } = await importProxy();

    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown
      .subscribe(() => process.exit(0));

    server.$started
      .subscribe(() => process.send?.('started'))

    await server.start(new JanusConfig(config));
  } catch (error) {
    process.send?.({ name: error.name, message: error.message });
    process.exit(1);
  }
});
