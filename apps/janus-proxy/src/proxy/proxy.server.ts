import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import express from 'express';
import http from 'http';
import httpProxy from 'http-proxy';

import { ConfigService } from '../config/config.service';
import { RoutesService } from '../routes/routes.service';
import { IRoute } from '../routes/route';

// Service
@Injectable()
export class ProxyServer implements OnApplicationBootstrap, OnApplicationShutdown {
  // Attributes
  private readonly _proxy = httpProxy.createProxyServer();
  private readonly _router = express();
  private readonly _server = http.createServer(this._router);

  // Constructor
  constructor(
    private readonly _config: ConfigService,
    private readonly _routes: RoutesService
  ) {
    // Submit to routes updates
    _routes.$routes.subscribe((route) => this._registerRoute(route));
  }

  // Lifecycle
  async onApplicationBootstrap(): Promise<void> {
    await this.listen();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }

  // Methods
  private _registerRoute(route: IRoute) {
    Logger.verbose(`New route ${route.name}: ${route.url} => ${route.targets}`);
    this._router.all(route.url, (req, res) => this._redirect(req, res, route.name));
  }

  private _redirect(req: express.Request, res: express.Response, name: string) {
    const route = this._routes.get(name);

    if (!route) {
      res.status(504);
      res.send();
    } else {
      const target = route.targets[0];

      Logger.verbose(`${req.url} => ${target}`);
      this._proxy.web(req, res, { target });
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
