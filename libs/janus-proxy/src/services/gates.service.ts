import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Subject } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { Event } from '../event';

import { Service } from './service.model';

// Service
@Injectable()
export class GatesService implements OnApplicationBootstrap {
  // Attributes
  private readonly _services = new Map<string, Service>();
  private readonly _events = new Subject<Event<Service, 'add'>>();

  readonly $events = this._events.asObservable();

  // Constructor
  constructor(
    private readonly _config: ConfigService
  ) {}

  // Lifecycle
  onApplicationBootstrap(): void {
    for (const service of this._config.services()) {
      this._addService(service);
    }
  }

  // Methods
  private _addService(service: Service) {
    this._services.set(service.name, service);
    this._events.next({ action: 'add', value: service });
  }

  listServices(): Service[] {
    return Array.from(this._services.values());
  }

  getService(name: string): Service | null {
    return this._services.get(name) || null;
  }
}
