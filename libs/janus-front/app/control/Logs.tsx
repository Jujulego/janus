import { gql, useQuery } from '@apollo/client';
import { FC, useEffect } from 'react';

import { ILog, LogFragment } from '@jujulego/janus-common';
import { Typography } from '@material-ui/core';

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
    })
  }, [subscribeToMore]);

  // Render
  return (
    <>
      { data?.logs?.map((log, i) => (
        <Typography key={i}>{ log.message }</Typography>
      )) }
    </>
  );
};
