import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import http from 'http';
import httpProxy from 'http-proxy';

import { ConfigService } from '../config/config.service';
import { ResolverService } from '../services/resolver.service';

// Service
@Injectable()
export class ProxyServer implements OnApplicationBootstrap, OnApplicationShutdown {
  // Attributes
  private readonly _proxy = httpProxy.createProxyServer();
  private readonly _server = http.createServer((req, res) => this._redirect(req, res));

  // Constructor
  constructor(
    private readonly _config: ConfigService,
    private readonly _resolver: ResolverService
  ) {}

  // Lifecycle
  async onApplicationBootstrap(): Promise<void> {
    await this.listen();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }

  // Methods
  private _send(res: http.ServerResponse, status: number, body: unknown) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(body));
    res.end();
  }

  private _redirect(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const gate = req.url && this._resolver.resolve(req.url);

      if (!gate) {
        Logger.verbose(`${req.url} => unresolved`);

        this._send(res, 404, {
          statusCode: 404,
          error: 'Not Found',
          message: `No route found for ${req.url}`
        });
      } else {
        const options: httpProxy.ServerOptions = {
          target: gate.target,
          changeOrigin: gate.changeOrigin,
          secure: gate.secure,
          ws: gate.ws
        };

        Logger.verbose(`${req.url} => ${gate.target}`);
        this._proxy.web(req, res, options, (error) => {
          if ((error as any).code === 'ECONNREFUSED') {
            Logger.warn(`${gate.target} is not responding ...`);
            this._send(res, 504, {
              statusCode: 504,
              error: 'Gateway Timeout',
            });
          } else {
            Logger.error(error.message);
            this._send(res, 500, {
              statusCode: 500,
              error: 'Server Error',
              message: error.message
            });
          }
        });
      }
    } catch (error) {
      Logger.error(error.message);

      this._send(res, 500, {
        statusCode: 500,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  async listen() {
    await this._server.listen(this._config.proxy.port, () => {
      Logger.log(`Proxy listening at http://localhost:${this._config.proxy.port}`);
    });
  }

  async stop() {
    await this._server.close();
    Logger.log("Proxy stopped");
  }
}
