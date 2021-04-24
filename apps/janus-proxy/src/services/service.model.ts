import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Gate } from './gate.model';

// Model
@ObjectType()
export class Service {
  // Attributes
  @Field()
  name: string;

  @Field()
  url: string;

  @Type(() => Gate)
  @Field(() => [Gate])
  gates: Gate[];
}
