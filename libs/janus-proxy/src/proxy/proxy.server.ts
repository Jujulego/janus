import {
  GatewayTimeoutException,
  HttpException,
  Injectable, InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import http from 'http';
import httpProxy from 'http-proxy';

import { ConfigService } from '../config/config.service';
import { ResolverService } from '../gates/resolver.service';
import { GatesService } from '../gates/gates.service';
import { Gate } from '../gates/gate.model';
import { Service } from '../gates/service.model';
import { Logger } from '../logger';

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
    private readonly _resolver: ResolverService,
    private readonly _gateService: GatesService,
  ) {}

  // Lifecycle
  async onApplicationBootstrap(): Promise<void> {
    await this.listen();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }

  // Methods
  private _sendError(res: http.ServerResponse, error: HttpException) {
    res.statusCode = error.getStatus();
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error.getResponse()));
    res.end();
  }

  private _redirect(req: http.IncomingMessage, res: http.ServerResponse) {
    const $req = new Subject<http.IncomingMessage>();

    $req.asObservable()
      .pipe(
        map((req) => this._resolveGate(req)),
        tap(([service, gate]) => this._logger.verbose(`${req.url} => ${gate.target} (service: ${service.name})`, { service: service.name, gate: gate.name })),
      )
      .subscribe(
        ([service, gate]) => {
          const options = this._buildOptions(gate);

          this._proxy.web(req, res, options, (error) => {
            // Handle proxy error
            if ((error as any).code === 'ECONNREFUSED') {
              this._logger.warn(`${options.target} is not responding ...`, { service: service.name, gate: gate.name });

              // Disable gate and try again
              this._gateService.disableGate(service.name, gate.name);
              $req.next(req);
            } else {
              this._logger.error(error.message);
              this._sendError(res, new InternalServerErrorException(error.message))
            }
          });
        },
        (error) => {
          if (error instanceof HttpException) {
            this._sendError(res, error);
          } else {
            this._logger.error(error.message);
            this._sendError(res, new InternalServerErrorException(error.message));
          }
        }
      );

    $req.next(req);
  }

  private _resolveGate(req: http.IncomingMessage): [Service, Gate] {
    const [service, gate] = this._resolver.resolve(req.url || '');

    if (!service) {
      this._logger.warn(`${req.url} => unresolved`);
      throw new NotFoundException(`No route found for ${req.url}`);
    } else if (!gate) {
      this._logger.warn(`${req.url} => unresolved (service: ${service.name})`, { service: service.name })
      throw new GatewayTimeoutException(`No gates available for ${req.url} (service: ${service.name})`);
    }

    return [service, gate];
  }

  private _buildOptions(gate: Gate): httpProxy.ServerOptions {
    return {
      target: gate.target,
      changeOrigin: gate.changeOrigin,
      secure: gate.secure,
      ws: gate.ws
    };
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
