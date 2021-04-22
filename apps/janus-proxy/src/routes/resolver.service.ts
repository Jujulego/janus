import { Injectable, Logger } from '@nestjs/common';
import Router from 'url-router';

import { IRoute } from './route';
import { RoutesService } from './routes.service';

// Service
@Injectable()
export class ResolverService {
  // Attributes
  private readonly _logger = new Logger(ResolverService.name);
  private readonly _router = new Router<IRoute>();

  // Constructor
  constructor(private readonly _routes: RoutesService) {
    this._routes.$routes.subscribe((route) => this._register(route));
  }

  // Methods
  private _register(route: IRoute) {
    const res = this._router.find(route.url);

    if (res) {
      this._logger.verbose(`Updated route ${res.handler.name} to ${route.name}: ${route.url} => ${route.targets}`);
      Object.assign(res.handler, route);
    } else {
      this._logger.verbose(`New route ${route.name}: ${route.url} => ${route.targets} `);
      this._router.add(route.url, route);
    }
  }

  resolve(url: string): IRoute | undefined {
    const res = this._router.find(url);
    return res?.handler;
  }
}
