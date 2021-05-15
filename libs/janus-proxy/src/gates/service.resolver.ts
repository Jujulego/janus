import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Service } from './service.model';
import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';
import { Gate } from './gate.model';

// Resolver
@Resolver(() => Service)
export class ServiceResolver {
  // Constructor
  constructor(
    private readonly _service: GatesService,
    private readonly _resolver: ResolverService
  ) {}

  // Queries
  @Query(() => Service, { nullable: true })
  service(
    @Args('name') name: string
  ): Service | null {
    return this._service.getService(name);
  }

  @Query(() => [Service])
  services(): Service[] {
    return this._service.listServices();
  }

  // Resolvers
  @ResolveField(() => Gate, { nullable: true })
  gate(
    @Parent() service: Service,
    @Args('name') name: string
  ): Gate | null {
    return service.gates.find(gate => gate.name === name) || null;
  }
}
