import { gql } from 'graphql.macro';

// Types
export type ILogMetadata = Record<string, unknown>;

// Model
export interface ILog {
  // Attributes
  level: string;
  message: string;
  timestamp: string;
  metadata: ILogMetadata;
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
