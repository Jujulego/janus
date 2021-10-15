import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { PubSub } from 'graphql-subscriptions';

import { ControlService } from './control.service';
import { LoggerTransport } from './logger.transport';
import { Log } from './log.model';
import { Logger } from '../logger';
import { LogsArgs } from './logs.args';

// Resolver
@Resolver()
export class ServerResolver {
  // Constructor
  constructor(
    private readonly _pubsub: PubSub,
    private readonly _server: ControlService,
    private readonly _transport: LoggerTransport
  ) {}

  // Queries
  @Query(() => [Log])
  logs(@Args() args: LogsArgs): Promise<Log[]> {
    return new Promise<Log[]>((resolve, reject) => {
      Logger.root.query({
        start: args.start,
        limit: args.limit,
        from: args.from,
        until: args.until,
        order: 'asc',
        fields: null
      }, (err, results: { file: Record<string, unknown>[] }) => {
        if (err) reject(err);

        // Format logs
        const logs: Log[] = [];
        for (const { message, level, timestamp, ...metadata } of results.file) {
          logs.push(plainToClass(Log, { message, level, timestamp, metadata }));
        }

        resolve(logs);
      });
    });
  }

  // Mutations
  @Mutation(() => Boolean)
  async shutdown(): Promise<boolean> {
    await this._server.shutdown();
    return true;
  }

  // Subscription
  @Subscription(() => Log, { name: 'logs' })
  logsSub(): AsyncIterator<Log> {
    return this._pubsub.asyncIterator<Log>('logs');
  }
}
