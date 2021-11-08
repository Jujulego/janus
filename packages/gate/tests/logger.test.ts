import { IWrappableLogger, makeLogger } from '../src';

// Constants
type Level = 'error' | 'warn' | 'info' | 'verbose' | 'debug';
const LEVEL_LIMIT_MATRIX: Record<Level, Record<Level, boolean>> = {
  'error': {
    'error': true,
    'warn': true,
    'info': true,
    'verbose': true,
    'debug': true,
  },
  'warn': {
    'error': false,
    'warn': true,
    'info': true,
    'verbose': true,
    'debug': true,
  },
  'info': {
    'error': false,
    'warn': false,
    'info': true,
    'verbose': true,
    'debug': true,
  },
  'verbose': {
    'error': false,
    'warn': false,
    'info': false,
    'verbose': true,
    'debug': true,
  },
  'debug': {
    'error': false,
    'warn': false,
    'info': false,
    'verbose': false,
    'debug': true,
  },
};

// Setup
beforeEach(() => {
  jest.resetAllMocks();
});

// Test suites
describe('makeLogger', () => {
  for (const level of ['error', 'warn', 'info', 'verbose', 'debug'] as Level[]) {
    for (const limit of ['error', 'warn', 'info', 'verbose', 'debug'] as Level[]) {
      it(`should ${LEVEL_LIMIT_MATRIX[level][limit] ? '' : 'not'} log ${level} using dedicated method, with limit at ${limit}`, () => {
        const wrapped: IWrappableLogger = {
          log: jest.fn(),
          [level]: jest.fn()
        };

        const logger = makeLogger(wrapped, limit);
        logger[level]('test');

        expect(wrapped.log).not.toHaveBeenCalled();

        if (LEVEL_LIMIT_MATRIX[level][limit]) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(wrapped[level]).toHaveBeenCalledWith('test');
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(wrapped[level]).not.toHaveBeenCalled();
        }
      });

      it(`should ${LEVEL_LIMIT_MATRIX[level][limit] ? '' : 'not'} log ${level} using log method, with limit at ${limit}`, () => {
        const wrapped: IWrappableLogger = {
          log: jest.fn()
        };

        const logger = makeLogger(wrapped, limit);
        logger[level]('test');

        if (LEVEL_LIMIT_MATRIX[level][limit]) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(wrapped.log).toHaveBeenCalledWith('test');
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(wrapped.log).not.toHaveBeenCalled();
        }
      });
    }
  }

  it('should log custom level using log method', () => {
    const wrapped: IWrappableLogger = {
      log: jest.fn()
    };

    const logger = makeLogger(wrapped);
    logger.log('level', 'test');

    expect(wrapped.log).toHaveBeenCalledWith('test');
  });
});