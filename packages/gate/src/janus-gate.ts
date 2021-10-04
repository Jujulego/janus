import { JanusConfig } from '@jujulego/janus-core';
import { GateFragment, IGate } from '@jujulego/janus-types';
import { GraphQLClient } from 'graphql-request';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { gql } from 'graphql.macro';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import WebSocket from 'ws';

// Class
export class JanusGate {
  // Attributes
  private readonly _endpoint = `http://localhost:${this.config.control.port}/graphql`;
  private readonly _qclient = new GraphQLClient(this._endpoint);
  private readonly _sclient = new SubscriptionClient(this._endpoint, { lazy: true, reconnect: true }, WebSocket);

  // Constructor
  constructor(
    readonly service: string,
    readonly gate: string,
    readonly config: JanusConfig
  ) {}

  // Statics
  static async fromConfigFile(service: string, name: string, config: string): Promise<JanusGate> {
    return new JanusGate(service, name, await JanusConfig.loadFile(config));
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
        gate: this.gate,
      },
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
      },
    });

    return sub.asObservable();
  }

  get enabled$(): Observable<boolean> {
    return this.gate$.pipe(
      map((gate) => gate.enabled)
    );
  }
}