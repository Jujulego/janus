import { Logger as CoreLogger, JanusServer } from '@jujulego/janus-core';
import winston, { format } from 'winston';

process.env.NODE_ENV = 'production';

// Setup logger
CoreLogger.root.remove(CoreLogger.consoleTransport);
CoreLogger.root.add(new winston.transports.Console({
  format: format.combine(
    format.timestamp({ format: () => new Date().toLocaleString() }),
    format.errors(),
    format.json()
  )
}));

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