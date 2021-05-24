import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

// Filter
@Catch(NotFoundException)
export class FallbackRouteFilter implements ExceptionFilter {
  // Constructor
  constructor(
    private readonly _app: AppService
  ) {}

  // Methods
  async catch(error: NotFoundException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Return NextJs 404 page
    await this._app.server.render404(req, res);
  }
}
