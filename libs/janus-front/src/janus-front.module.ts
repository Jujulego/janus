import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Module
@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class JanusFrontModule {}
