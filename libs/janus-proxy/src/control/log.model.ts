import { Field, ObjectType } from '@nestjs/graphql';

// Model
@ObjectType()
export class Log {
  // Attributes
  @Field() level: string;
  @Field() message: string;
  @Field() timestamp: string;
  @Field() metadata: string;
}
