import { LoggerService } from '@nestjs/common';
import winston, { format } from 'winston';
import chalk from 'chalk';

// Class
export class Logger implements LoggerService {
  // Attributes
  private readonly _logger: winston.Logger;

  // Constructor
  constructor(context?: string) {
    this._logger = Logger.root.child({ context });
  }

  // Statics
  static readonly consoleTransport = new winston.transports.Console({
    format: format.combine(
      format.timestamp({ format: () => new Date().toLocaleString() }),
      format.printf(({ context, pid, message, timestamp }) => context
        ? chalk`[Nest] ${pid} - {white ${timestamp}} {grey [${context}]} ${message}`
        : chalk`[Nest] ${pid} - {white ${timestamp}} ${message}`
      ),
      format.colorize({ all: true }),
    ),
  });

  static readonly root = winston.createLogger({
    level: 'debug',
    format: format.combine(
      { transform: (info) => Object.assign(info, { pid: process.pid }) },
      format.json(),
    ),
    transports: [this.consoleTransport]
  });

  static error(message: any, trace?: string,  metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.error({ message, trace, ...metadata });
  }

  static warn(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.warn({ message, ...metadata });
  }

  static log(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.info({ message, ...metadata });
  }

  static verbose(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.verbose({ message, ...metadata });
  }

  static debug(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this.root.debug({ message, ...metadata });
  }

  // Methods
  error(message: any, trace?: string, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.error({ message, trace, ...metadata });
  }

  warn(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.warn({ message, ...metadata });
  }

  log(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.info({ message, ...metadata });
  }

  info(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.info({ message, ...metadata });
  }

  verbose(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.verbose({ message, ...metadata });
  }

  debug(message: any, metadata?: string | Record<string, string | number>): void {
    if (typeof metadata === 'string') {
      metadata = { context: metadata };
    }

    this._logger.debug({ message, ...metadata });
  }
}
