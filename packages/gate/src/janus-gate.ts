import { GateFragment, IGate, IJanusConfig, ILogger, loadJanusConfigFile } from '@jujulego/janus-types';
import { GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { print } from 'graphql';
import { gql } from 'graphql.macro';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import WebSocket from 'ws';

// Class
export class JanusGate {
  // Attributes
  private readonly _endpoint = `http://localhost:${this.config.control.port}/graphql`;
  private readonly _qclient = new GraphQLClient(this._endpoint);
  private readonly _sclient = createClient({ url: this._endpoint, lazy: true, webSocketImpl: WebSocket });

  // Constructor
  constructor(
    readonly service: string,
    readonly gate: string,
    readonly config: IJanusConfig
  ) {}

  // Statics
  static async fromConfigFile(service: string, name: string, config: string, logger?: ILogger): Promise<JanusGate> {
    return new JanusGate(service, name, await loadJanusConfigFile(config, logger));
  }

  // Methods
  async enable(): Promise<void> {
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
        gate: this.gate,
      },
    );

    if (!data) {
      throw new Error(`Gate ${this.service}.${this.gate} not found`);
    }

    if (!data.enabled) {
      throw new Error(`Gate ${this.service}.${this.gate} not enabled`);
    }
  }

  // Properties
  get gate$(): Observable<IGate> {
    const sub = new Subject<IGate>();

    // Request
    this._sclient.subscribe<{ gate: IGate }>({
      query: print(gql`
          subscription Gate($service: String!, $gate: String!) {
              gate(service: $service, gate: $gate) {
                  ...Gate
              }
          }

          ${GateFragment}
      `),
      variables: {
        service: this.service,
        gate: this.gate,
      },
    }, {
      next(value) {
        if (value.data) sub.next(value.data.gate);
      },
      complete() {
        sub.complete();
      },
      error(error: unknown) {
        sub.error(error);
      }
    });

    return sub.asObservable();
  }

  get enabled$(): Observable<boolean> {
    return this.gate$.pipe(
      map((gate) => gate.enabled)
    );
  }
}