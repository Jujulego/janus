import winston, { format } from 'winston';
import chalk from 'chalk';

import { JanusServer } from './server';
import { Logger } from './logger';

// Bootstrap
(async function () {
  try {
    // Logger
    Logger.root.add(new winston.transports.Console({
      format: format.combine(
        format.printf(({ context, pid, message, timestamp }) => context
          ? chalk`[Nest] ${pid} - {white ${new Date(timestamp).toLocaleString()}} {grey [${context}]} ${message}`
          : chalk`[Nest] ${pid} - {white ${new Date(timestamp).toLocaleString()}} ${message}`
        ),
        format.colorize({ all: true }),
      ),
    }));

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
