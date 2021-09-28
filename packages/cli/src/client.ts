import { JanusConfig } from '@jujulego/janus-core';
import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Observable, Subject } from 'rxjs';
import WebSocket from 'ws';

// Types
export type Vars = Record<string, unknown>;

// Class
export class JanusClient {
  // Attributes
  private readonly _endpoint = `http://localhost:${this.config.control.port}/graphql`;
  private readonly _qclient = new GraphQLClient(this._endpoint);
  private readonly _sclient = new SubscriptionClient(this._endpoint.replace(/^http/, 'ws'), { lazy: true, reconnect: true }, WebSocket);

  // Constructor
  constructor(readonly config: JanusConfig) {}

  // Methods
  async query<R, V extends Vars = Vars>(query: DocumentNode, variables?: V): Promise<R> {
    return await this._qclient.request<R, V>(query, variables);
  }

  async mutation<R, V extends Vars = Vars>(query: DocumentNode, variables?: V): Promise<R> {
    return await this._qclient.request<R, V>(query, variables);
  }

  subscription<R, V extends Vars = Vars>(query: DocumentNode, variables?: V): Observable<R> {
    const obs = this._sclient.request({ query, variables });

    // Build observable
    const sub = new Subject<R>();

    obs.subscribe({
      next(value) {
        sub.next(value.data as R);
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
}
