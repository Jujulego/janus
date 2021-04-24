import { Field, Int, ObjectType } from '@nestjs/graphql';

// Model
@ObjectType()
export class Gate {
  // Attributes
  @Field({ description: 'Target URL' })
  target: string;

  @Field({ description: 'Enable the gate' })
  enabled: boolean;

  @Field(() => Int,{ description: 'The gate with the lowest priority will be chosen' })
  priority: number;

  @Field({ description: 'Changes the origin of the host header to the target URL' })
  changeOrigin: boolean;

  @Field({ description: 'Enable HTTPS support' })
  secure: boolean;

  @Field({ description: 'Enable WebSocket support' })
  ws: boolean;
}
