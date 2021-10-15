import { ArgsType, Field } from '@nestjs/graphql';

// Args
@ArgsType()
export class LogsArgs {
  // Attributes
  @Field({ nullable: true })
  start?: number;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  from?: Date;

  @Field({ nullable: true })
  until?: Date;
}