import { Logger as CoreLogger } from '@jujulego/janus-core';
import { ILogger, ILogMetadata } from '@jujulego/janus-types';
import { format, Logger } from 'winston';
import Transport from 'winston-transport';
import ora from 'ora';
import chalk from 'chalk';

// Constants
const MESSAGE = Symbol.for('message');

// Transport
export class OraTransport extends Transport {
  // Attributes
  readonly _spinner = ora();

  // Methods
  private _keepSpinner<T>(fun: () => T): T {
    // Save state
    let spinning = false;
    let text = '';

    if (this._spinner.isSpinning) {
      spinning = true;
      text = this._spinner.text;
    }

    try {
      return fun();
    } finally {
      // Restore state
      if (!this._spinner.isSpinning && spinning) {
        this._spinner.start(text);
      }
    }
  }

  log(info: any, next: () => void): void {
    // Print message
    const msg = info[MESSAGE] as string;

    this._keepSpinner(() => {
      this._spinner.stop();

      for (const line of msg.split('\n')) {
        process.stderr.write(line + '\n');
      }
    });

    next();
  }

  spin(message: string): void {
    this._spinner.start(message);
  }

  succeed(log: string): void {
    this._spinner.succeed(log);
  }

  fail(log: Error | string): void {
    if (typeof log === 'string') {
      this._spinner.fail(log);
    } else {
      this._spinner.fail(log.stack || log.toString());
    }
  }

  stop(): void {
    this._spinner.stop();
  }
}

// Logger
export class OraLogger implements ILogger {
  // Logger
  constructor(
    private readonly logger: Logger,
    private readonly transport: OraTransport
  ) {}

  // Methods
  // - logger
  log(level: string, message: string, meta?: ILogMetadata): void {
    this.logger.log(level, message, meta);
  }

  debug(message: string): void {
    this.logger.debug({ message });
  }

  verbose(message: string): void {
    this.logger.verbose({ message });
  }

  info(message: string): void {
    this.logger.info({ message });
  }

  warn(message: string): void {
    this.logger.warn({ message });
  }

  error(message: string): void {
    this.logger.error({ message });
  }

  child(options: Record<string, unknown>): Logger {
    return this.logger.child(options);
  }

  // - ora
  spin(msg: string): void {
    this.transport.spin(msg);
  }

  succeed(msg: string): void {
    this.transport.succeed(msg);
  }

  fail(msg: string): void {
    this.transport.fail(msg);
  }

  stop(): void {
    this.transport.stop();
  }

  // Properties
  get level(): string {
    return this.logger.level;
  }

  set level(level: string) {
    this.logger.level = level;
  }
}

// Setup
export const transport = new OraTransport({
  format: format.combine(
    format.printf(({ context, message, label, ...mtd }) => {
      const log = context ? chalk`{grey [${context}]} ${message}` : message;

      if (label === 'Nest') {
        return chalk`[${label}] ${mtd.pid} - {white ${new Date(mtd.timestamp).toLocaleString()}} ${log}`;
      }

      return log;
    }),
    format.colorize({ all: true }),
  )
});

CoreLogger.root.add(transport);

export const logger = new OraLogger(CoreLogger.root, transport);
