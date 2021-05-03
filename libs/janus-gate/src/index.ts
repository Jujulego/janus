import { gql, GraphQLClient } from 'graphql-request';

import { DEFAULT_CONTROL_PORT, JanusConfig, JanusServer } from '@jujulego/janus-proxy';

// Class
export class JanusGate {
  // Attributes
  private readonly client = new GraphQLClient(`http://localhost:${this.config.control?.port || DEFAULT_CONTROL_PORT}/graphql`);

  // Constructor
  constructor(readonly service: string, readonly name: string, readonly config: JanusConfig) {}

  // Statics
  static async fromConfigFile(service: string, name: string, config: string): Promise<JanusGate> {
    return new JanusGate(service, name, await JanusServer.loadConfigFile(config));
  }

  // Methods
  async enable(): Promise<void> {
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
  }
}
