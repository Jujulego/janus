import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { Subject } from 'rxjs';
import { exhaustMap, filter } from 'rxjs/operators';

import { JanusConfig } from '@jujulego/janus-config';

import { AppModule } from './app.module';
import { ServerResolver } from './control/server.resolver';
import { GateResolver } from './services/gate.resolver';
import { ServiceResolver } from './services/service.resolver';
import { ConfigService } from './config/config.service';
import { ControlService } from './control/control.service';

// Server
export class JanusServer {
  // Attributes
  private readonly _started = new Subject<void>();
  readonly $started = this._started.asObservable();

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
      config = await JanusConfig.loadFile(config);
    }

    this.config.config = config;

    // Start server
    this.app.enableShutdownHooks();

    await this.app.listen(this.config.control.port, () => {
      Logger.log(`Server listening at http://localhost:${this.config.control.port}`);
      this._started.next();

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
