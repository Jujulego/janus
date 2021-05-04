import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Gate } from './gate.model';
import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';

// Resolver
@Resolver(() => Gate)
export class GateResolver {
  // Constructor
  constructor(
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
  enableGate(
    @Args('service') service: string,
    @Args('gate') name: string
  ): Gate | null {
    const gate = this.gate(service, name);

    if (gate) {
      gate.enabled = true;
    }

    return gate;
  }

  @Mutation(() => Gate, { nullable: true })
  disableGate(
    @Args('service') service: string,
    @Args('gate') name: string
  ): Gate | null {
    const gate = this.gate(service, name);

    if (gate) {
      gate.enabled = false;
    }

    return gate;
  }
}
