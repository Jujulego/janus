import { Mutation, Resolver } from '@nestjs/graphql';
import { ServerService } from './server.service';

// Resolver
@Resolver()
export class ServerResolver {
  // Constructor
  constructor(
    private readonly server: ServerService
  ) {}

  // Mutations
  @Mutation(() => Boolean)
  async shutdown(): Promise<boolean> {
    await this.server.shutdown();
    return true;
  }
}
