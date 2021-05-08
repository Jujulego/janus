import { fork } from 'child_process';
import { gql, GraphQLClient } from 'graphql-request';
import { Observable, SubscriptionClient } from 'subscriptions-transport-ws';
import WebSocket from 'ws';

import { JanusConfig } from '@jujulego/janus-config';

// Class
export class JanusGate {
  // Attributes
  private readonly _endpoint = `http://localhost:${this.config.control.port}/graphql`;
  private readonly _qclient = new GraphQLClient(this._endpoint);
  private readonly _sclient = new SubscriptionClient(this._endpoint, { lazy: true, reconnect: true }, WebSocket);

  // Constructor
  constructor(readonly service: string, readonly name: string, readonly config: JanusConfig) {}

  // Statics
  static async fromConfigFile(service: string, name: string, config: string): Promise<JanusGate> {
    return new JanusGate(service, name, await JanusConfig.loadFile(config));
  }

  // Methods
  private async autoStart<T>(fun: () => Promise<T>): Promise<T> {
    try {
      return await fun();
    } catch (error) {
      if (error.errno === 'ECONNREFUSED') {
        await this.start();
        return await fun();
      }

      throw error;
    }
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = fork('./proxy.js', [], {
        cwd: __dirname,
        detached: true,
        stdio: 'ignore'
      });

      child.on('message', (msg: string | Error) => {
        if (msg === 'started') {
          resolve();
        } else {
          reject(msg);
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
  get gate$(): Observable<unknown> {
    return this._sclient.request({
      query: gql`
        subscription Gate($service: String!, $gate: String!) {
            gate(service: $service, gate: $gate) {
                name
                enabled
            }
        }
      `,
      variables: {
        service: this.service,
        gate: this.name
      }
    });
  }
}
