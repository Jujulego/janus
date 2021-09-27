import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { Event } from '../event';

// Service
@Injectable()
export class ControlService {
  // Attributes
  private readonly _events = new Subject<Event<null, 'shutdown'>>();

  readonly $events = this._events.asObservable();

  // Methods
  shutdown(): void {
    this._events.next({ value: null, action: 'shutdown' });
  }
}
