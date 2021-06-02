import { Mutation, Resolver } from '@nestjs/graphql';
import { ControlService } from './control.service';

// Resolver
@Resolver()
export class ServerResolver {
  // Constructor
  constructor(private readonly server: ControlService) {}

  // Mutations
  @Mutation(() => Boolean)
  async shutdown(): Promise<boolean> {
    await this.server.shutdown();
    return true;
  }
}
