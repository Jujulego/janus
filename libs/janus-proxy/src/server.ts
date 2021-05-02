import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { Subject } from 'rxjs';
import { exhaustMap, filter } from 'rxjs/operators';
import Ajv from 'ajv';
import fs from 'fs/promises';
import yaml from 'yaml';

import { AppModule } from './app.module';
import { ServerResolver } from './control/server.resolver';
import { GateResolver } from './services/gate.resolver';
import { ServiceResolver } from './services/service.resolver';
import { ConfigService } from './config/config.service';
import { ControlService } from './control/control.service';
import { JanusConfig } from './janus-config';

import configSchema from './janus-config.schema.json';

// Server
export class JanusServer {
  // Attributes
  private readonly _shutdown = new Subject<void>();
  readonly $shutdown = this._shutdown.asObservable();

  // Constructor
  private constructor(
    readonly app: INestApplication
  ) {}

  // Statics
  static async createServer(): Promise<JanusServer> {
    const app = await NestFactory.create(AppModule);
    return new JanusServer(app);
  }

  static async loadConfigFile(file: string): Promise<JanusConfig> {
    try {
      // Check if is file
      const stat = await fs.stat(file);

      if (!stat.isFile()) {
        throw new Error(`File ${file} does not exists or is not a file`);
      }

      // Read file
      const str = await fs.readFile(file, 'utf-8');
      const data = yaml.parse(str) as JanusConfig;

      // Validate file
      const ajv = new Ajv({ allErrors: true, useDefaults: true, logger: Logger });
      const validate = ajv.compile(configSchema);

      if (!validate(data)) {
        if (validate.errors) {
          Logger.error('Errors in config file:');

          for (const err of validate.errors) {
            Logger.error(`- ${err.instancePath} ${err.message}`);
          }
        }

        throw new Error(`Invalid config file ${file}`)
      }

      Logger.log(`Config file ${file} loaded`);
      return data;

    } catch (error) {
      Logger.error('Failed to load config file');

      if (error.code === 'ENOENT') {
        throw new Error(`File ${file} does not exists`);
      }

      throw error;
    }
  }

  static async generateGQLSchema(): Promise<GraphQLSchema> {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: false });
    await app.init();

    // Generate schema
    const factory = app.get(GraphQLSchemaFactory);
    return await factory.create([
      GateResolver,
      ServiceResolver,
      ServerResolver
    ]);
  }

  // Methods
  private async handleShutdown(): Promise<void> {
    Logger.log('Shutdown requested');
    await this.app.close();

    Logger.log('Server stopped');
    this._shutdown.next();
    this._shutdown.complete();
  }

  async start(config: string | JanusConfig): Promise<void> {
    // Load configuration
    if (typeof config === 'string') {
      config = await JanusServer.loadConfigFile(config);
    }

    this.config.config = config;

    // Start server
    this.app.enableShutdownHooks();

    await this.app.listen(this.config.server.port, () => {
      Logger.log(`Server listening at http://localhost:${this.config.server.port}`);

      // Listen for shutdown events
      this.control.$events
        .pipe(
          filter(event => event.action === 'shutdown'),
          exhaustMap(() => this.handleShutdown()),
        )
        .subscribe();
    });
  }

  async stop(): Promise<void> {
    await this.handleShutdown();
  }

  // Properties
  private get config(): ConfigService {
    return this.app.get(ConfigService);
  }

  private get control(): ControlService {
    return this.app.get(ControlService);
  }
}
