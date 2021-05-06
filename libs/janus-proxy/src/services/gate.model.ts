import { Field, Int, ObjectType } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';

import { IGateConfig } from '@jujulego/janus-config';

// Model
@ObjectType()
export class Gate {
  // Attributes
  @Field()
  name: string;

  @Field()
  target: string;

  @Field()
  enabled: boolean;

  @Field(() => Int,{ description: 'The gate with the lowest priority will be chosen' })
  priority: number;

  @Field({ description: 'Changes the origin of the host header to the target URL' })
  changeOrigin: boolean;

  @Field({ description: 'Enable HTTPS support' })
  secure: boolean;

  @Field({ description: 'Enable WebSocket support' })
  ws: boolean;

  // Statics
  static fromConfig(name: string, index: number, config: IGateConfig): Gate {
    return plainToClass(Gate, {
      name:         name,
      target:       config.target,
      enabled:      config.enabled ?? false,
      priority:     index,
      changeOrigin: config.changeOrigin ?? false,
      secure:       config.secure ?? false,
      ws:           config.ws ?? false
    });
  }
}
