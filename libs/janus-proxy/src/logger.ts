import { LoggerService } from '@nestjs/common';
import winston, { format } from 'winston';
import chalk from 'chalk';

// Class
export class Logger implements LoggerService {
  // Attributes
  private readonly _logger: winston.Logger;

  // Constructor
  constructor(context?: string) {
    this._logger = Logger._root.child({ context });
  }

  // Statics
  private static _root = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: format.combine(
          format.timestamp({ format: () => new Date().toLocaleString() }),
          format.printf(({ context, message, timestamp }) => context ? chalk`[Nest] ${process.pid} - {white ${timestamp}} {grey [${context}]} ${message}` : chalk`[Nest] ${process.pid} - {white ${timestamp}} ${message}`),
          format.colorize({ all: true }),
        ),
      })
    ]
  });

  static error(message: any, trace?: string, context?: string): void {
    this._root.error({ message, context });
  }

  static warn(message: any, context?: string): void {
    this._root.warn({ message, context });
  }

  static log(message: any, context?: string): void {
    this._root.info({ message, context });
  }

  static verbose(message: any, context?: string): void {
    this._root.verbose({ message, context });
  }

  static debug(message: any, context?: string): void {
    this._root.debug({ message, context });
  }

  // Methods
  error(message: any, trace?: string, context?: string): void {
    this._logger.error({ message, context });
  }

  warn(message: any, context?: string): void {
    this._logger.warn({ message, context });
  }

  log(message: any, context?: string): void {
    this._logger.info({ message, context });
  }

  verbose(message: any, context?: string): void {
    this._logger.verbose({ message, context });
  }

  debug(message: any, context?: string): void {
    this._logger.debug({ message, context });
  }
}
