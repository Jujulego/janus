import { fork } from 'child_process';
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import WebSocket from 'ws';

import { IGate, GateFragment } from '@jujulego/janus-common';
import { JanusConfig } from '@jujulego/janus-config';

// Types
interface JanusGateOptions {
  autoStart?: boolean;
}

// Class
export class JanusGate {
  // Attributes
  private readonly _endpoint = `http://localhost:${this.config.control.port}/graphql`;
  private readonly _qclient = new GraphQLClient(this._endpoint);
  private readonly _sclient = new SubscriptionClient(this._endpoint, { lazy: true, reconnect: true }, WebSocket);

  // Constructor
  constructor(
    readonly service: string,
    readonly name: string,
    readonly config: JanusConfig,
    readonly options: JanusGateOptions = {}
  ) {}

  // Statics
  static async fromConfigFile(service: string, name: string, config: string, options?: JanusGateOptions): Promise<JanusGate> {
    return new JanusGate(service, name, await JanusConfig.loadFile(config), options);
  }

  // Methods
  private async autoStart<T>(fun: () => Promise<T>): Promise<T> {
    try {
      return await fun();
    } catch (error) {
      if (error.errno === 'ECONNREFUSED' && (this.options.autoStart ?? false)) {
        await this.start();
        return await fun();
      }

      throw error;
    }
  }

  start(): Promise<void> {
    console.log('Starting proxy server ...');
    return new Promise((resolve, reject) => {
      const child = fork('./proxy.js', [], {
        cwd: __dirname,
        detached: true,
        stdio: 'ignore'
      });

      child.on('message', (msg: 'started' | Error) => {
        if (msg === 'started') {
          console.log('Proxy server started');
          resolve();
        } else {
          reject(new Error(msg.message));
        }
      });

      child.send(this.config.config);
    });
  }

  async enable(): Promise<void> {
    return await this.autoStart(async () => {
      const { enableGate: data } = await this._qclient.request<{ enableGate?: { enabled: boolean } }>(
        gql`
            mutation EnableGate($service: String!, $gate: String!) {
                enableGate(service: $service, gate: $gate) {
                    enabled
                }
            }
        `,
        {
          service: this.service,
          gate: this.name
        }
      );

      if (!data) {
        throw new Error(`Gate ${this.service}.${this.name} not found`);
      }

      if (!data.enabled) {
        throw new Error(`Gate ${this.service}.${this.name} not enabled`);
      }
    });
  }

  // Properties
  get gate$(): Observable<IGate> {
    // Request
    const obs = this._sclient.request({
      query: gql`
        subscription Gate($service: String!, $gate: String!) {
            gate(service: $service, gate: $gate) {
                ...Gate
            }
        }
        
        ${GateFragment}
      `,
      variables: {
        service: this.service,
        gate: this.name
      }
    });

    // Build observable
    const sub = new Subject<IGate>();

    obs.subscribe({
      next(value) {
        sub.next(value.data as IGate);
      },
      error(error) {
        sub.error(error);
      },
      complete() {
        sub.complete();
      }
    });

    return sub.asObservable();
  }

  get enabled$(): Observable<boolean> {
    return this.gate$.pipe(
      map(gate => gate.enabled)
    );
  }
}
