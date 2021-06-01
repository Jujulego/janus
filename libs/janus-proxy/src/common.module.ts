import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { JsonObjScalar } from './json-obj.scalar';

// Module
@Module({
  providers: [
    JsonObjScalar,
    { provide: PubSub, useValue: new PubSub() }
  ],
  exports: [
    PubSub
  ]
})
export class CommonModule {}
