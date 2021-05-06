import { fork } from 'child_process';
import { gql, GraphQLClient } from 'graphql-request';

import { JanusConfig } from "@jujulego/janus-config";

// Class
export class JanusGate {
  // Attributes
  private readonly client = new GraphQLClient(`http://localhost:${this.config.control.port}/graphql`);

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
      const { enableGate: data } = await this.client.request<{ enableGate?: { enabled: boolean } }>(
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
}
