import gql from 'graphql-tag';

// Model
export interface ILog {
  // Attributes
  id: number;
  level: string;
  message: string;
  timestamp: string;
  metadata: string;
}

// Fragment
export const LogFragment = gql`
  fragment Log on Log {
      id
      level
      message
      timestamp
      metadata
  }
`;
