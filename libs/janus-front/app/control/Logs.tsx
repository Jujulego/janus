import { gql, useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { FC, useEffect } from 'react';

import { ILog, LogFragment } from '@jujulego/janus-common';

import { Log } from './Log';

// Types
interface LogsData {
  logs: ILog[];
}

interface LogsEvent {
  logs: ILog;
}

// Queries
export const LOGS_QRY = gql`
  query Logs {
      logs {
          ...Log
      }
  }
  
  ${LogFragment}
`;

export const LOGS_SUB = gql`
  subscription Logs {
      logs {
          ...Log
      }
  }
  
  ${LogFragment}
`;

// Component
export const Logs: FC = () => {
  // Query logs
  const { data, subscribeToMore } = useQuery<LogsData>(LOGS_QRY);

  // Effects
  useEffect(() => {
    subscribeToMore<LogsEvent>({
      document: LOGS_SUB,
      updateQuery: (prev, { subscriptionData }) => ({
        ...prev,
        logs: [...prev.logs, subscriptionData.data.logs]
      })
    });
  }, [subscribeToMore]);

  // Render
  return (
    <Box p={1}>
      { data?.logs?.map((log) => <Log key={log.id} log={log} />) }
    </Box>
  );
};
