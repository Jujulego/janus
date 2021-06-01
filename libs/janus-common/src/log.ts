import gql from 'graphql-tag';

// Model
export interface ILog {
  // Attributes
  level: string;
  message: string;
  timestamp: string;
  metadata: any;
}

// Fragment
export const LogFragment = gql`
  fragment Log on Log {
      level
      message
      timestamp
      metadata
  }
`;
