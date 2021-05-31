import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ILog } from '@jujulego/janus-common';

// Model
@ObjectType()
export class Log implements ILog {
  // Attributes
  @Field(() => Int) id: number;
  @Field() level: string;
  @Field() message: string;
  @Field() timestamp: string;
  @Field() metadata: string;
}
