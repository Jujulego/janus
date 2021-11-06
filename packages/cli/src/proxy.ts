import { Logger as CoreLogger, JanusServer } from '@jujulego/janus-core';
import winston, { format } from 'winston';

process.env.NODE_ENV = 'production';

// Types
interface IMessage {
  config: string;
  daemon: boolean;
}

// Setup logger
const trans = new winston.transports.Console({
  format: format.combine(
    format.timestamp({ format: () => new Date().toLocaleString() }),
    format.errors(),
    format.json()
  )
});
CoreLogger.root.add(trans);

// Start server when config is received
process.once('message', async ({ config, daemon }: IMessage) => {
  try {
    // Create server
    const server = await JanusServer.createServer();

    // Prepare shutdown
    server.$shutdown.subscribe(() => process.exit(0));
    server.$started.subscribe(() => {
      if (daemon) CoreLogger.root.remove(trans);
      process.send?.('started');
    });

    await server.start(config);
  } catch (error) {
    process.send?.({ name: error.name, message: error.message });
    process.exit(1);
  }
});