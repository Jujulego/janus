import { ILogMetadata } from '../src';

// Constants
export const testLogger = {
  error:   jest.fn<void, [string, ILogMetadata | undefined]>(),
  warn:    jest.fn<void, [string, ILogMetadata | undefined]>(),
  info:    jest.fn<void, [string, ILogMetadata | undefined]>(),
  verbose: jest.fn<void, [string, ILogMetadata | undefined]>(),
  debug:   jest.fn<void, [string, ILogMetadata | undefined]>(),
  log:     jest.fn<void, [string, string, ILogMetadata | undefined]>(),
};