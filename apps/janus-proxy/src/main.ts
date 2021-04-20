import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

// Bootstrap
(async function() {
  // Create Nest app
  const app = await NestFactory.create(AppModule);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Start control serveur
  await app.listen(5000, () => {
    Logger.log("Server listening at http://localhost:5000");
  });
})();
