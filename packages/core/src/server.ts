import { loadJanusConfigFile } from '@jujulego/janus-common';
import { IJanusConfig } from '@jujulego/janus-types';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { Subject } from 'rxjs';
import { exhaustMap, filter } from 'rxjs/operators';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { ConfigService } from './config';
import { ControlService, ServerResolver } from './control';
import { JsonObjScalar } from './json-obj.scalar';
import { Logger } from './logger';
import { GateResolver, ServiceResolver } from './services';
import { PidFile } from './pidfile';
import winston from 'winston';

// Server
export class JanusServer {
  // Attributes
  private readonly _logger = new Logger(JanusServer.name);
  private _pidfile?: PidFile;

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
    const app = await NestFactory.create(AppModule, { logger: new Logger() });
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
      ServerResolver,
    ], [JsonObjScalar]);
  }

  // Methods
  private async handleShutdown(): Promise<void> {
    // Shutdown app
    this._logger.info('Shutdown requested');
    await this.app.close();

    // Delete pidfile
    await this._pidfile?.delete();

    // Emit shutdown event
    this._logger.info('Server stopped');
    this._shutdown.next();
    this._shutdown.complete();
  }

  async start(config: string | IJanusConfig): Promise<boolean> {
    // Load configuration
    if (typeof config === 'string') {
      config = await loadJanusConfigFile(config, new Logger('JanusConfig'));
    }

    this.config.config = config;

    // pid file
    this._pidfile = new PidFile(config, this._logger);
    if (!await this._pidfile.create()) return false;

    // logfile
    Logger.root.add(new winston.transports.File({
      filename: config.logfile,
      options: { flag: 'w' }
    }));

    // Setup
    this.app.enableShutdownHooks();

    if (process.env.NODE_ENV === 'development') {
      // Log access requests
      this.app.use(morgan('dev', {
        stream: {
          write: (str: string) => {
            this._logger.debug(str.trim());
          },
        },
      }));
    }

    try {
      // Start server
      await this.app.listen(this.config.control.port, () => {
        this._logger.info(`Server listening at http://localhost:${this.config.control.port}`);
        this._started.next();

        // Listen for shutdown events
        this.control.$events
          .pipe(
            filter((event) => event.action === 'shutdown'),
            exhaustMap(() => this.handleShutdown()),
          )
          .subscribe();
      });
    } catch (err) {
      await this._pidfile?.delete();
      throw err;
    }

    return true;
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
