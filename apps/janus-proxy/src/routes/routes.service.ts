import { Injectable, NotFoundException, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Subject } from 'rxjs';

import { ConfigService } from '../config/config.service';

import { AddRoute, IRoute, UpdateRoute } from './route';

// Service
@Injectable()
export class RoutesService implements OnApplicationBootstrap, OnApplicationShutdown {
  // Attributes
  private readonly _index = new Map<string, IRoute>();
  private readonly _routes = new Subject<IRoute>();

  readonly $routes = this._routes.asObservable();

  // Constructor
  constructor(private readonly _config: ConfigService) {}

  // Lifecycle
  onApplicationBootstrap(): void {
    for (const service of this._config.services()) {
      this.add(service.name, {
        url: service.url,
        target: 'http://localhost:3333'// service.target
      });
    }
  }

  onApplicationShutdown(signal?: string): any {
    this._routes.complete();
  }

  // Methods
  list(): IRoute[] {
    return Array.from(this._index.values());
  }

  get(name: string): IRoute | null {
    return this._index.get(name) || null;
  }

  add(name: string, data: AddRoute): IRoute {
    // Get or create
    let route = this.get(name);

    if (!route) {
      route = {
        name,
        url: data.url,
        targets: []
      };
    }

    // Add route
    route.targets.unshift(data.target);

    // Store and emit
    this._index.set(name, route);
    this._routes.next(route);

    return route;
  }

  update(name: string, data: UpdateRoute): IRoute {
    // Get or create
    let route = this.get(name);

    if (!route) {
      throw new NotFoundException();
    }

    // Add route
    route.targets.unshift(data.target);

    // Store and emit
    this._index.set(name, route);
    this._routes.next(route);

    return route;
  }
}
