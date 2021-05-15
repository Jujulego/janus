import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { PluginDataService } from '@jujulego/janus-common';

import { AppService } from './app.service';

// Controller
@Controller('/app')
export class AppController {
  // Constructor
  constructor(
    private readonly app: AppService,
    private readonly data: PluginDataService,
  ) {}

  // Endpoints
  @Get()
  async home(@Req() req: Request, @Res() res: Response, @Query() query: any): Promise<void> {
    (req as any).data = this.data;
    await this.app.server.render(req, res, '/', query);
  }

  @Get('*')
  async statics(@Req() req: Request, @Res() res: Response): Promise<void> {
    (req as any).data = this.data;
    const handler = this.app.server.getRequestHandler();
    await handler(req, res);
  }
}
