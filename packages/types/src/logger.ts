import { ILogMetadata } from './log';

// Interface
export interface ILogger {
  // Methods
  error(message: string, metadata?: ILogMetadata): void;
  warn(message: string, metadata?: ILogMetadata): void;
  info(message: string, metadata?: ILogMetadata): void;
  verbose(message: string, metadata?: ILogMetadata): void;
  debug(message: string, metadata?: ILogMetadata): void;
  log(level: string, message: string, metadata?: ILogMetadata): void;
}

// Class
export class ConsoleLogger implements ILogger {
  // Methods
  error(message: string, metadata?: ILogMetadata): void {
    this.log('error', message, metadata);
  }

  warn(message: string, metadata?: ILogMetadata): void {
    this.log('warn', message, metadata);
  }

  info(message: string, metadata?: ILogMetadata): void {
    this.log('info', message, metadata);
  }

  verbose(message: string, metadata?: ILogMetadata): void {
    this.log('verbose', message, metadata);
  }

  debug(message: string, metadata?: ILogMetadata): void {
    this.log('debug', message, metadata);
  }

  log(level: string, message: string, metadata?: ILogMetadata): void {
    // eslint-disable-next-line no-console
    console.log(`${level}: ${message} ${metadata}`);
  }
}