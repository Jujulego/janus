import { Controller, Get, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';

// Controller
@Controller()
@UseInterceptors(AppInterceptor)
export class AppController {
  // Constructor
  constructor(
    private readonly app: AppService
  ) {}

  // Endpoints
  @Get()
  async home(@Req() req: Request, @Res() res: Response, @Query() query: any): Promise<void> {
    await this.app.server.render(req, res, '/', query);
  }

  @Get(['/_next/*', '/__nextjs_original-stack-frame'])
  async statics(@Req() req: Request, @Res() res: Response): Promise<void> {
    const handler = this.app.server.getRequestHandler();
    await handler(req, res);
  }
}
