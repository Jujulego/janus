import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

// Bootstrap
(async function() {
  try {
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
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
})();
