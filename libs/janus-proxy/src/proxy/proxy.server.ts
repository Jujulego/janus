import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common';
import http from 'http';
import httpProxy from 'http-proxy';

import { ConfigService } from '../config/config.service';
import { ResolverService } from '../services/resolver.service';
import { Gate } from '../services/gate.model';

// Service
@Injectable()
export class ProxyServer implements OnApplicationBootstrap, OnApplicationShutdown {
  // Attributes
  private readonly _proxy = httpProxy.createProxyServer();
  private readonly _server = http.createServer((req, res) => this._redirect(req, res));
  private readonly _logger = new Logger(ProxyServer.name);

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
      const gate = this._resolve(req);

      const options: httpProxy.ServerOptions = {
        target: gate.target,
        changeOrigin: gate.changeOrigin,
        secure: gate.secure,
        ws: gate.ws
      };

      this._logger.verbose(`${req.url} => ${gate.target}`);
      this._proxy.web(req, res, options, (error) => {
        if ((error as any).code === 'ECONNREFUSED') {
          this._logger.warn(`${gate.target} is not responding ...`);
          this._send(res, 504, {
            statusCode: 504,
            error: 'Gateway Timeout',
            message: `${gate.target} is not responding ...`
          });
        } else {
          this._logger.error(error.message);
          this._send(res, 500, {
            statusCode: 500,
            error: 'Server Error',
            message: error.message
          });
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        this._send(res, error.getStatus(), error.getResponse());
      } else {
        this._logger.error(error.message);

        this._send(res, 500, {
          statusCode: 500,
          error: 'Server Error',
          message: error.message
        });
      }
    }
  }

  private _resolve(req: http.IncomingMessage): Gate {
    const gate = req.url && this._resolver.resolve(req.url);

    if (!gate) {
      this._logger.verbose(`${req.url} => unresolved`);
      throw new NotFoundException(`No route found for ${req.url}`);
    } else {
      this._logger.verbose(`${req.url} => ${gate.target}`);
      return gate;
    }
  }

  async listen() {
    await this._server.listen(this._config.proxy.port, () => {
      this._logger.log(`Proxy listening at http://localhost:${this._config.proxy.port}`);
    });
  }

  async stop() {
    await this._server.close();
    this._logger.log('Proxy stopped');
  }
}
