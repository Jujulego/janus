import { Injectable } from '@nestjs/common';
import { filter } from 'rxjs/operators';

import { Logger } from '../logger';

import { GatesService } from './gates.service';
import { Service } from './service.model';
import { Gate } from './gate.model';

// Service
@Injectable()
export class ResolverService {
  // Attributes
  private readonly _logger = new Logger(ResolverService.name);
  private readonly _routes: [string, string][] = [];

  // Constructor
  constructor(
    private readonly _gates: GatesService
  ) {
    this._gates.$events
      .pipe(
        filter(event => event.action === 'add'),
      )
      .subscribe(({ value }) => {
        this._register(value)
      })
  }

  // Methods
  private _register(service: Service) {
    this._logger.verbose(`New route ${service.name}: ${service.url}`);
    this._routes.push([service.url, service.name]);
  }

  resolve(url: string): Gate | null {
    for (const [route, name] of this._routes) {
      if (url.startsWith(route)) {
        const service = this._gates.getService(name);

        if (!service) {
          continue;
        }

        // Search gate
        let gate: Gate | null = null;

        for (const g of service.gates) {
          if (g.enabled && (!gate || (g.priority < gate.priority))) {
            gate = g;
          }
        }

        if (gate) {
          return gate;
        }
      }
    }

    return null;
  }
}
