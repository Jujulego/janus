// Interface
export interface ILogger {
  // Methods
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  verbose(message: string): void;
  debug(message: string): void;
  log(level: string, message: string): void;
}

// Class
export class ConsoleLogger implements ILogger {
  // Methods
  error(message: string): void {
    this.log('error', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  info(message: string): void {
    this.log('info', message);
  }

  verbose(message: string): void {
    this.log('verbose', message);
  }

  debug(message: string): void {
    this.log('debug', message);
  }

  log(level: string, message: string): void {
    // eslint-disable-next-line no-console
    console.log(`${level}: ${message}`);
  }
}