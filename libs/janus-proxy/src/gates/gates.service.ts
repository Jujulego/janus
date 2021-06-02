import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Subject } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { Event } from '../event';
import { Logger } from '../logger';

import { Service } from './service.model';
import { Gate } from './gate.model';

// Service
@Injectable()
export class GatesService implements OnApplicationBootstrap {
  // Attributes
  private readonly _services = new Map<string, Service>();
  private readonly _events = new Subject<Event<Service, 'add'>>();
  private readonly _logger = new Logger(GatesService.name);

  readonly $events = this._events.asObservable();

  // Constructor
  constructor(
    private readonly _pubsub: PubSub,
    private readonly _config: ConfigService,
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

  getGate(service: string, name: string): Gate | null {
    return this.getService(service)?.getGate(name) || null;
  }

  enableGate(service: string, name: string): Gate | null {
    const srv = this.getService(service);
    const gate = srv?.getGate(name) || null;

    if (gate && !gate.enabled) {
      gate.enabled = true;

      this._pubsub.publish(service, { service: srv });
      this._pubsub.publish(`${service}.${name}`, { gate });

      this._logger.log(`Gate ${service}.${name} enabled`, { service, gate: name });
    }

    return gate;
  }

  disableGate(service: string, name: string): Gate | null {
    const srv = this.getService(service);
    const gate = srv?.getGate(name) || null;

    if (gate?.enabled) {
      gate.enabled = false;

      this._pubsub.publish(service, { service: srv });
      this._pubsub.publish(`${service}.${name}`, { gate });

      this._logger.log(`Gate ${service}.${name} disabled`, { service, gate: name });
    }

    return gate;
  }
}
