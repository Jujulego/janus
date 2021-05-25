import { Field, ObjectType } from '@nestjs/graphql';

// Model
@ObjectType()
export class Log {
  // Attributes
  @Field() level: string;
  @Field() json: string;
}
