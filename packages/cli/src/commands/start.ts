import { JanusServer } from '@jujulego/janus-core';
import { firstValueFrom, map } from 'rxjs';

import { logger } from '../logger';
import { CommandHandler } from '../wrapper';

// Handler
export const startCommand: CommandHandler = async (args) => {
  try {
    // Create server
    logger.spin('Starting proxy ...');
    const server = await JanusServer.createServer();
    logger.stop();

    // Start server
    await server.start(args.config);

    return firstValueFrom(server.$shutdown.pipe(map(() => 0)));
  } catch (error) {
    logger.error(error);
    return 1;
  }
};
