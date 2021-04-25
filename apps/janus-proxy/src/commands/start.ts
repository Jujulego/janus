import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { ConfigService } from '../config/config.service';

// Command
export const command = 'start';
export const aliases = ['$0'];

export async function handler() {
  // Create Nest app
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // Load configuration
  const config = app.get(ConfigService);
  await config.load('janus.config.yml');

  // Start control serveur
  await app.listen(config.server.port, () => {
    Logger.log(`Server listening at http://localhost:${config.server.port}`);
  });
}
