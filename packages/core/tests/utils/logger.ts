import Transport from 'winston-transport';

import { Logger } from '../../src';

class NoopTransport extends Transport {
  // Methods
  log(): void {
    return;
  }

  logv(): void {
    return;
  }
}

Logger.root.add(new NoopTransport());
