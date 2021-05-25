import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ControlService } from './control.service';
import { LoggerTransport } from './logger.transport';
import { Log } from './log.model';

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
  logs(): Log[] {
    return this._transport.history;
  }

  // Mutations
  @Mutation(() => Boolean)
  async shutdown(): Promise<boolean> {
    await this._server.shutdown();
    return true;
  }

  // Subscription
  @Subscription(() => Log, { name: 'logs' })
  logsSub() {
    return this._pubsub.asyncIterator<Log>('logs');
  }
}
