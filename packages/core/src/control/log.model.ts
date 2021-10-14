import { Field, ObjectType } from '@nestjs/graphql';

import { ILog, ILogMetadata } from '@jujulego/janus-types';

import { JsonObj } from '../json-obj.scalar';

// Model
@ObjectType()
export class Log implements ILog {
  // Attributes
  @Field() level: string;
  @Field() message: string;
  @Field() timestamp: string;

  @Field(() => JsonObj)
  metadata: ILogMetadata;
}
