import { gql, GraphQLClient } from 'graphql-request';

// Class
export class JanusGate {
  // Attributes
  private readonly client = new GraphQLClient('http://localhost:5000/graphql');

  // Constructor
  constructor(readonly service: string, readonly name: string) {}

  // Methods
  async enable(): Promise<void> {
    const { enableGate: data } = await this.client.request<{ enableGate?: { enabled: boolean } }, { service: string, gate: string }>(
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
