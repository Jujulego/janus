import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandBuilder } from 'yargs';

import { AppModule } from '../app.module';
import { ConfigService } from '../config/config.service';

// Types
export interface StartArgs {
  config: string;
}

// Command
export const command = 'start';
export const aliases = ['$0'];
export const describe = 'Starts the proxy server';

export const builder: CommandBuilder = {
  config: {
    alias: 'c',
    description: 'Path to the configuration file',
    default: 'janus.config.yml'
  }
};

export async function handler(args: StartArgs) {
  try {
    // Create Nest app
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks();

    // Load configuration
    const config = app.get(ConfigService);
    await config.load(args.config);

    // Start control server
    await app.listen(config.server.port, () => {
      Logger.log(`Server listening at http://localhost:${config.server.port}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
