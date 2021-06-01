import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PubSub } from 'graphql-subscriptions';
import Transport from 'winston-transport';
import { format } from 'winston';

import { Logger } from '../logger';

import { Log } from './log.model';

// Services
@Injectable()
export class LoggerTransport extends Transport implements OnModuleInit {
  // Attributes
  readonly history: Log[] = [];

  // Constructor
  constructor(private readonly _pubsub: PubSub) {
    super({
      format: format.combine(
        format.metadata(),
        format.timestamp()
      )
    });
  }

  // Lifecycle
  onModuleInit(): void {
    Logger.root.add(this);
  }

  // Methods
  private _save(log: Log) {
    this.history.push(log);
  }

  async log(info: any, next?: () => void): Promise<void> {
    // Start next transport as soon as possible
    if (next) {
      setImmediate(next);
    }

    // Store and send via pubsub
    try {
      const log = plainToClass(Log, info);

      this._save(log);
      await this._pubsub.publish('logs', { logs: log });

      this.emit('logged', info);
    } catch (error) {
      this.emit('warn', error);
    }
  }
}
