import { Query, Resolver } from '@nestjs/graphql';

import { Service } from './service.model';
import { GatesService } from './gates.service';

// Resolver
@Resolver(() => Service)
export class ServiceResolver {
  // Constructor
  constructor(
    private readonly _service: GatesService
  ) {}

  // Queries
  @Query(() => [Service])
  services(): Service[] {
    return this._service.listServices();
  }
}
