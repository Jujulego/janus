import { ILogger, ILogMetadata } from '@jujulego/janus-types';

// Types
export interface IWrappableLogger {
  log(msg: string): void;
  error?: (msg: string) => void;
  warn?: (msg: string) => void;
  info?: (msg: string) => void;
  verbose?: (msg: string) => void;
  debug?: (msg: string) => void;
}

// Function
export function makeLogger(logger: IWrappableLogger, level = 'info'): ILogger {
  return {
    log(lvl: string, message: string): void {
      switch (lvl) {
        case 'error':
          (logger.error || logger.log).call(logger, message);
          break;

        case 'warn':
          if (['debug', 'verbose', 'info', 'warn'].includes(level)) {
            (logger.warn || logger.log).call(logger, message);
          }

          break;

        case 'info':
          if (['debug', 'verbose', 'info'].includes(level)) {
            (logger.info || logger.log).call(logger, message);
          }

          break;

        case 'debug':
          if ('debug' === level) {
            (logger.debug || logger.log).call(logger, message);
          }

          break;

        case 'verbose':
          if (['debug', 'verbose'].includes(level)) {
            (logger.verbose || logger.log).call(logger, message);
          }

          break;

        default:
          logger.log(message);
      }
    },

    error(message: string, metadata?: ILogMetadata): void {
      this.log('error', message, metadata);
    },

    warn(message: string, metadata?: ILogMetadata): void {
      this.log('warn', message, metadata);
    },

    info(message: string, metadata?: ILogMetadata): void {
      this.log('info', message, metadata);
    },

    verbose(message: string, metadata?: ILogMetadata): void {
      this.log('verbose', message, metadata);
    },

    debug(message: string, metadata?: ILogMetadata): void {
      this.log('debug', message, metadata);
    },
  };
}

makeLogger(console);