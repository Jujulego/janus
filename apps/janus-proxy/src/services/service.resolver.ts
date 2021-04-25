import { Args, Query, Resolver } from '@nestjs/graphql';

import { Gate } from './gate.model';
import { Service } from './service.model';
import { GatesService } from './gates.service';
import { ResolverService } from './resolver.service';

// Resolver
@Resolver(() => Service)
export class ServiceResolver {
  // Constructor
  constructor(
    private readonly _service: GatesService,
    private readonly _resolver: ResolverService
  ) {}

  // Queries
  @Query(() => [Service])
  services(): Service[] {
    return this._service.listServices();
  }

  @Query(() => Gate, { nullable: true })
  resolve(
    @Args('url') url: string
  ): Gate | null {
    return this._resolver.resolve(url);
  }
}
