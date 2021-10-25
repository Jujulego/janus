import { IJanusConfig } from '@jujulego/janus-types';
import _Ajv, { ValidateFunction } from 'ajv';
import fs, { promises as pfs } from 'fs';
import path from 'path';
import yaml from 'yaml';

import { loadJanusConfigFile } from '../src';
import configSchema from '../config.schema.json';
import { testLogger } from './test-logger';

// Constants
const MOCK_CONFIG: IJanusConfig = {
  pidfile: '.janus.pid',
  control: { port: 10000 },
  proxy: { port: 80 },
  services: {
    test: {
      url: '/test',
      gates: {
        local: {
          target: 'https://example.com'
        }
      }
    }
  }
};

// Mocks
jest.mock('ajv');
const Ajv = _Ajv as jest.MockedClass<typeof _Ajv>;

// Setup
beforeEach(() => {
  // Mocks
  jest.resetAllMocks();
  jest.restoreAllMocks();

  jest.spyOn(pfs, 'stat')
    .mockResolvedValue({ isFile: () => true } as fs.Stats);

  jest.spyOn(pfs, 'readFile')
    .mockResolvedValue('config data');

  jest.spyOn(yaml, 'parse')
    .mockReturnValue(MOCK_CONFIG);

  Ajv.mockImplementation();
  Ajv.prototype.compile.mockReturnValue((() => true) as unknown as ValidateFunction);
});

// Tests suites
describe('loadJanusConfigFile', () => {
  // Tests
  it('should return a valid config', async () => {
    const config = {
      ...MOCK_CONFIG,
      pidfile: path.resolve('/project/.janus.pid'),
    };

    // Checks
    await expect(loadJanusConfigFile('/project/test.yml', testLogger))
      .resolves.toEqual(config);

    // Checks calls
    expect(pfs.stat).toHaveBeenCalledWith('/project/test.yml');
    expect(pfs.readFile).toHaveBeenCalledWith('/project/test.yml', 'utf-8');
    expect(yaml.parse).toHaveBeenCalledWith('config data');
    expect(Ajv.prototype.compile).toHaveBeenCalledWith(configSchema);

    expect(testLogger.verbose).toHaveBeenCalledWith('Config file /project/test.yml loaded');
    expect(testLogger.debug).toHaveBeenCalledWith(`Config loaded: ${JSON.stringify(config, null, 2)}`);
  });

  it('should add default control values', async () => {
    const { control: _, ...mock } = MOCK_CONFIG;

    // Mocks
    jest.spyOn(yaml, 'parse')
      .mockReturnValue(mock);

    // Checks
    await expect(loadJanusConfigFile('/project/test.yml', testLogger))
      .resolves.toEqual({
        ...mock,
        control: { port: 5000 },
        pidfile: path.resolve('/project/.janus.pid'),
      });
  });

  it('should add default proxy values', async () => {
    const { proxy: _, ...mock } = MOCK_CONFIG;

    // Mocks
    jest.spyOn(yaml, 'parse')
      .mockReturnValue(mock);

    // Checks
    await expect(loadJanusConfigFile('/project/test.yml', testLogger))
      .resolves.toEqual({
        ...mock,
        proxy: { port: 3000 },
        pidfile: path.resolve('/project/.janus.pid'),
      });
  });

  it('should fail if path is not a file', async () => {
    // Mocks
    jest.spyOn(pfs, 'stat')
      .mockResolvedValue({ isFile: () => false } as fs.Stats);
    
    // Checks
    await expect(loadJanusConfigFile('test.yml', testLogger))
      .rejects.toEqual(new Error('File test.yml does not exists or is not a file'));

    expect(testLogger.error).toHaveBeenCalledWith('Failed to load config file');
  });

  it('should fail if stat call rejects with code ENOENT', async () => {
    // Mocks
    jest.spyOn(pfs, 'stat')
      .mockRejectedValue({ code: 'ENOENT' });

    // Checks
    await expect(loadJanusConfigFile('test.yml', testLogger))
      .rejects.toEqual(new Error('File test.yml does not exists'));

    expect(testLogger.error).toHaveBeenCalledWith('Failed to load config file');
  });

  it('should fail if stat call rejects', async () => {
    // Mocks
    jest.spyOn(pfs, 'stat')
      .mockRejectedValue(new Error('stat failed !'));

    // Checks
    await expect(loadJanusConfigFile('test.yml', testLogger))
      .rejects.toEqual(new Error('stat failed !'));

    expect(testLogger.error).toHaveBeenCalledWith('Failed to load config file');
  });

  it('should fail if readFile call rejects with code ENOENT', async () => {
    // Mocks
    jest.spyOn(pfs, 'readFile')
      .mockRejectedValue({ code: 'ENOENT' });

    // Checks
    await expect(loadJanusConfigFile('test.yml', testLogger))
      .rejects.toEqual(new Error('File test.yml does not exists'));

    expect(testLogger.error).toHaveBeenCalledWith('Failed to load config file');
  });

  it('should fail if readFile call rejects', async () => {
    // Mocks
    jest.spyOn(pfs, 'readFile')
      .mockRejectedValue(new Error('readFile failed !'));

    // Checks
    await expect(loadJanusConfigFile('test.yml', testLogger))
      .rejects.toEqual(new Error('readFile failed !'));

    expect(testLogger.error).toHaveBeenCalledWith('Failed to load config file');
  });

  it('should fail if validation fails', async () => {
    // Mocks
    Ajv.prototype.compile
      .mockReturnValue(Object.assign(() => false, {
        errors: [
          { instancePath: 'prop1', message: 'invalid prop' },
          { instancePath: 'prop2', message: 'should be a number' }
        ]
      }) as unknown as ValidateFunction);

    // Checks
    await expect(loadJanusConfigFile('test.yml', testLogger))
      .rejects.toEqual(new Error('Invalid config file test.yml'));

    expect(testLogger.error.mock.calls).toEqual([
      ['Errors in config file:'],
      ['- prop1 invalid prop'],
      ['- prop2 should be a number']
    ]);
  });
});