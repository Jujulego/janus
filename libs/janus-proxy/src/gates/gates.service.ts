import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Subject } from 'rxjs';

import { DataService } from '@jujulego/janus-common';

import { ConfigService } from '../config/config.service';
import { Event } from '../event';

import { Service } from './service.model';
import { Gate } from './gate.model';

// Service
@Injectable()
export class GatesService extends DataService implements OnApplicationBootstrap {
  // Attributes
  private readonly _services = new Map<string, Service>();
  private readonly _events = new Subject<Event<Service, 'add'>>();

  readonly $events = this._events.asObservable();

  // Constructor
  constructor(
    private readonly _pubsub: PubSub,
    private readonly _config: ConfigService
  ) {
    super();
  }

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

  getGate(service: string, name: string): Gate | null {
    return this.getService(service)?.getGate(name) || null;
  }

  enableGate(service: string, name: string): Gate | null {
    const gate = this.getGate(service, name);

    if (gate && !gate.enabled) {
      gate.enabled = true;
      this._pubsub.publish(`${service}.gates`, { gate });
    }

    return gate;
  }

  disableGate(service: string, name: string): Gate | null {
    const gate = this.getGate(service, name);

    if (gate?.enabled) {
      gate.enabled = false;
      this._pubsub.publish(`${service}.gates`, { gate });
    }

    return gate;
  }
}
