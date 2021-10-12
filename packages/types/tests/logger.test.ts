/* eslint-disable no-console */
import { ConsoleLogger } from '../src';

// Setup
let logger: ConsoleLogger;

beforeEach(() => {
  logger = new ConsoleLogger();

  // Mocks
  jest.restoreAllMocks();
  jest.spyOn(console, 'log').mockImplementation();
});

// Tests suites
describe('ConsoleLogger.log', () => {
  it('should print log to the console', () => {
    logger.log('test', 'message', { data: 584 });
    expect(console.log).toHaveBeenCalledWith('test: message {"data":584}');
  });
});

describe('ConsoleLogger.error', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log').mockImplementation();
  });

  it('should call log method with "error" level', () => {
    logger.error('message', { data: 584 });
    expect(logger.log).toHaveBeenCalledWith('error', 'message',  { data: 584 });
  });
});

describe('ConsoleLogger.warn', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log').mockImplementation();
  });

  it('should call log method with "warn" level', () => {
    logger.warn('message', { data: 584 });
    expect(logger.log).toHaveBeenCalledWith('warn', 'message',  { data: 584 });
  });
});

describe('ConsoleLogger.info', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log').mockImplementation();
  });

  it('should call log method with "info" level', () => {
    logger.info('message', { data: 584 });
    expect(logger.log).toHaveBeenCalledWith('info', 'message',  { data: 584 });
  });
});

describe('ConsoleLogger.verbose', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log').mockImplementation();
  });

  it('should call log method with "verbose" level', () => {
    logger.verbose('message', { data: 584 });
    expect(logger.log).toHaveBeenCalledWith('verbose', 'message',  { data: 584 });
  });
});

describe('ConsoleLogger.debug', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log').mockImplementation();
  });

  it('should call log method with "debug" level', () => {
    logger.debug('message', { data: 584 });
    expect(logger.log).toHaveBeenCalledWith('debug', 'message',  { data: 584 });
  });
});