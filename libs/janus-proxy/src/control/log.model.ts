import { Field, ObjectType } from '@nestjs/graphql';

import { ILog } from '@jujulego/janus-common';
import { JsonObj } from '../json-obj.scalar';

// Model
@ObjectType()
export class Log implements ILog {
  // Attributes
  @Field() level: string;
  @Field() message: string;
  @Field() timestamp: string;

  @Field(() => JsonObj)
  metadata: any;
}
