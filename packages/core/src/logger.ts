import { ILogger, ILogMetadata } from '@jujulego/janus-types';
import { LoggerService } from '@nestjs/common';
import winston, { format } from 'winston';

// Class
export class Logger implements ILogger, LoggerService {
  // Attributes
  private readonly _logger: winston.Logger;

  // Constructor
  constructor(context?: string) {
    this._logger = Logger.root.child({ context });
  }

  // Statics
  static readonly root = winston.createLogger({
    level: 'debug',
    format: format.combine(
      { transform: (info) => Object.assign(info, { pid: process.pid }) },
      format.json(),
    ),
    transports: []
  });

  static log(level: string, message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.log(level, { message, ...metadata });
  }

  static error(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.error({ message, ...metadata });
  }

  static warn(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.warn({ message, ...metadata });
  }

  static verbose(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.verbose({ message, ...metadata });
  }

  static debug(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.debug({ message, ...metadata });
  }

  // Methods
  log(level: string, message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.log(level, { message, ...metadata });
  }

  error(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.error({ message, ...metadata });
  }

  warn(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.warn({ message, ...metadata });
  }

  info(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.info({ message, ...metadata });
  }

  verbose(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.verbose({ message, ...metadata });
  }

  debug(message: string, metadata?: string | ILogMetadata): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.debug({ message, ...metadata });
  }
}
