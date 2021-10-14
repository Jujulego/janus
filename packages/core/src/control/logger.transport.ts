import { Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PubSub } from 'graphql-subscriptions';

import { Log } from './log.model';
import { Logger } from '../logger';

// Services
@Injectable()
export class LoggerTransport implements OnModuleInit {
  // Constructor
  constructor(private readonly _pubsub: PubSub) {}

  // Lifecycle
  onModuleInit(): void {
    Logger.root.stream({ start: -1 }).on('log', async ({ message, level, timestamp, transport, ...metadata }) => {
      if (transport.includes('file')) {
        const log = plainToClass(Log, { message, level, timestamp, metadata });
        await this._pubsub.publish('logs', { logs: log });
      }
    });
  }
}
