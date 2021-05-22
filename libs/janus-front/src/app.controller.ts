import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

// Controller
@Controller()
export class AppController {
  // Constructor
  constructor(
    private readonly app: AppService
  ) {}

  // Endpoints
  @Get('/:name')
  async service(
    @Param('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any
  ): Promise<void> {
    await this.app.server.render(req, res, `/${name}`, query);
  }

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
