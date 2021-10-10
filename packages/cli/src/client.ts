import { JanusConfig } from '@jujulego/janus-core';
import { DocumentNode, print } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { Observable, Subject } from 'rxjs';
import WebSocket from 'ws';

// Types
export type Vars = Record<string, unknown>;

// Class
export class JanusClient {
  // Attributes
  private readonly _endpoint = `http://localhost:${this.config.control.port}/graphql`;
  private readonly _qclient = new GraphQLClient(this._endpoint);
  private readonly _sclient = createClient({ url: this._endpoint.replace(/^http/, 'ws'), lazy: true, webSocketImpl: WebSocket });

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
    const sub = new Subject<R>();

    // Request
    this._sclient.subscribe<R>({ query: print(query), variables }, {
      next(value) {
        if (value.data) sub.next(value.data);
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
}
