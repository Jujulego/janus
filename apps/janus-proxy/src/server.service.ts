import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Event } from './event';

// Service
@Injectable()
export class ServerService {
  // Attributes
  private readonly _events = new Subject<Event<null, 'shutdown'>>()

  readonly $events = this._events.asObservable();

  // Constructor
  constructor() {}

  // Methods
  shutdown() {
    this._events.next({ value: null, action: 'shutdown' });
  }
}
