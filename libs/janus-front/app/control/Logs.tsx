import { gql, useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { FC, useEffect, useRef } from 'react';

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

  // Ref
  const container = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const wrapper = container.current?.parentElement;

    if (data && wrapper) {
      wrapper.scrollTo(0, wrapper.scrollHeight);
    }
  }, [data?.logs?.length]);

  // Render
  return (
    <Box ref={container} p={1}>
      { data?.logs?.map((log) => <Log key={log.id} log={log} />) }
    </Box>
  );
};
