import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

// Module
@Module({
  controllers: [
    AppController
  ]
})
export class JanusFrontModule {}
