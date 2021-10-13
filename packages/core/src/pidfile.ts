import { IJanusConfig } from '@jujulego/janus-types';
import { promises as fs } from 'fs';
import { lock } from 'proper-lockfile';

import { Logger } from './logger';

// Class
export class PidFile {
  // Constructor
  constructor(
    private readonly _config: IJanusConfig,
    private readonly _logger: Logger
  ) {}

  // Statics
  private static processIsRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Methods
  private async lock<R>(fun: () => Promise<R>): Promise<R> {
    const release = await lock(this._config.pidfile);

    try {
      return await fun();
    } finally {
      await release();
    }
  }

  async create(): Promise<boolean> {
    try {
      this._logger.debug(`Create pid file ${process.pid}`);
      await fs.writeFile(this._config.pidfile, process.pid.toString(), { flag: 'wx', encoding: 'utf-8' });
    } catch (err) {
      if (err.code === 'EEXIST') {
        // Try to update pidfile
        return await this.update();
      } else {
        this._logger.error(err);
      }

      return false;
    }

    return true;
  }

  async update(): Promise<boolean> {
    // Get other process pid
    const pid = parseInt(await fs.readFile(this._config.pidfile, 'utf-8'));
    this._logger.warn(`Looks like janus was already started (${pid})`);

    // Check if other process is still running
    if (PidFile.processIsRunning(pid)) return false;

    try {
      // Lock pidfile
      await this.lock(async () => {
        this._logger.debug(`Update pid file ${pid} => ${process.pid}`);
        await fs.writeFile(this._config.pidfile, process.pid.toString(), { flag: 'w', encoding: 'utf-8' });
      });

      this._logger.info(`${pid} was killed or stopped, pidfile updated`);
    } catch (err) {
      this._logger.error(err);
      return false;
    }

    return true;
  }

  async delete(): Promise<void> {
    this._logger.debug('Delete pid file');
    await fs.unlink(this._config.pidfile);
  }
}