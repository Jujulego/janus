import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import next from 'next';
import path from 'path';

// Services
@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  // Attributes
  private _server: ReturnType<typeof next>;

  // Methods
  async onModuleInit(): Promise<void> {
    this._server = next({
      dev: process.env.NODE_ENV !== 'production',
      dir: path.join(__dirname, '../app'),
    });
    await this._server.prepare();
  }

  async onModuleDestroy(): Promise<void> {
    await this._server.close();
  }

  // Properties
  get server() {
    return this._server;
  }
}
