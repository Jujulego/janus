import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import http from 'http';
import httpProxy from 'http-proxy';

// Service
@Injectable()
export class ProxyServer implements OnApplicationBootstrap, OnApplicationShutdown {
  // Attributes
  private readonly proxy = httpProxy.createProxyServer();
  private readonly server = http.createServer((req, res) => this._redirect(req, res));

  // Lifecycle
  async onApplicationBootstrap(): Promise<void> {
    await this.listen();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }

  // Methods
  private _redirect(req: http.IncomingMessage, res: http.ServerResponse) {
    Logger.log(`${req.url} => http://localhost:5000${req.url}`);
    this.proxy.web(req, res, { target: 'http://localhost:5000' })
  }

  async listen() {
    await this.server.listen(3000, () => {
      Logger.log("Proxy listening at http://localhost:3000");
    });
  }

  async stop() {
    await this.server.close();
    Logger.log("Proxy stopped");
  }
}
