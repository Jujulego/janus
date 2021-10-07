import { gql } from 'graphql.macro';

// Model
export interface ILog {
  // Attributes
  level: string;
  message: string;
  timestamp: string;
  metadata: Record<string, unknown>;
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
