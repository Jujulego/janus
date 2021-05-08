import gql from 'graphql-tag';

// Model
export interface IGate {
  // Attributes
  name: string;
  target: string;
  enabled: boolean;
  priority: number;
  changeOrigin: boolean;
  secure: boolean;
  ws: boolean;
}

// Fragment
export const GateFragment = gql`
  fragment Gate on Gate {
      name
      target
      enabled
      priority
      changeOrigin
      secure
      ws
  }
`;
