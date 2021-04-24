import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Service } from './service.model';
import { ConfigService } from '../config/config.service';

// Service
@Injectable()
export class GatesService implements OnApplicationBootstrap {
  // Attributes
  private readonly _services = new Map<string, Service>();

  // Constructor
  constructor(
    private readonly _config: ConfigService
  ) {}

  // Lifecycle
  onApplicationBootstrap(): void {
    for (const service of this._config.services()) {
      this._services.set(service.name, service);
    }
  }

  // Methods
  listServices(): Service[] {
    return Array.from(this._services.values());
  }
}
