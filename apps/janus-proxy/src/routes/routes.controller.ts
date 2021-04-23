import { Body, Controller, Get, NotFoundException, Param, Put, ValidationPipe } from '@nestjs/common';

import { IRoute, UpdateRoute } from './route';
import { RoutesService } from './routes.service';

// Controller
@Controller('/routes')
export class RoutesController {
  // Constructor
  constructor(private readonly _routes: RoutesService) {}

  // Endpoints
  @Get('/')
  list(): IRoute[] {
    return this._routes.list();
  }

  @Get('/:name')
  get(@Param('name') name: string): IRoute {
    const route = this._routes.get(name);

    if (!route) {
      throw new NotFoundException();
    }

    return route;
  }

  @Put('/:name')
  put(
    @Param('name') name: string,
    @Body(ValidationPipe) data: UpdateRoute
  ): IRoute {
    return this._routes.update(name, data);
  }
}
