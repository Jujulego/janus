import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Gate } from './gate.model';
import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';

// Resolver
@Resolver(() => Gate)
export class GateResolver {
  // Constructor
  constructor(
    private readonly _pubsub: PubSub,
    private readonly _service: GatesService,
    private readonly _resolver: ResolverService
  ) {}

  // Queries
  @Query(() => Gate, { nullable: true })
  gate(
    @Args('service') service: string,
    @Args('gate') name: string
  ): Gate | null {
    return this._service.getService(service)?.getGate(name) || null;
  }

  @Query(() => Gate, { nullable: true })
  resolve(
    @Args('url') url: string
  ): Gate | null {
    return this._resolver.resolve(url);
  }

  // Mutation
  @Mutation(() => Gate, { nullable: true })
  async enableGate(
    @Args('service') service: string,
    @Args('gate') name: string
  ): Promise<Gate | null> {
    const gate = this.gate(service, name);

    if (gate) {
      gate.enabled = true;
      await this._pubsub.publish(`${service}.gates`, { gate });
    }

    return gate;
  }

  @Mutation(() => Gate, { nullable: true })
  async disableGate(
    @Args('service') service: string,
    @Args('gate') name: string
  ): Promise<Gate | null> {
    const gate = this.gate(service, name);

    if (gate) {
      gate.enabled = false;
      await this._pubsub.publish(`${service}.gates`, { gate });
    }

    return gate;
  }

  // Subscriptions
  @Subscription(() => Gate, {
    name: 'gate',
    filter: (payload: Gate, variables) => payload.name === variables.name
  })
  gateSubscription(
    @Args('service') service: string,
    @Args('gate') name: string
  ) {
    return this._pubsub.asyncIterator<Gate>(`${service}.gates`);
  }
}
