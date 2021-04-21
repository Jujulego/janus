import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Subject } from 'rxjs';

import { ConfigService } from '../config/config.service';

import { IAddRoute, IRoute } from './route';

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
        target: service.target
      });
    }
  }

  onApplicationShutdown(signal?: string): any {
    this._routes.complete();
  }

  // Methods
  get(name: string): IRoute | null {
    return this._index.get(name) || null;
  }

  add(name: string, data: IAddRoute): void {
    const route: IRoute = this.get(name) || {
      name,
      url: data.url,
      targets: []
    };

    route.targets.push(data.target);

    // Store and emit
    this._index.set(name, route);
    this._routes.next(route)
  }
}
