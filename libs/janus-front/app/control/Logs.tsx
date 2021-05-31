import { gql, useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { FC, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import ResizeObserver from 'resize-observer-polyfill';

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

  // State
  const [height, setHeight] = useState(200);

  // Ref
  const container = useRef<HTMLDivElement>(null);
  const list = useRef<List>(null);

  // Effects
  useEffect(() => {
    const obs = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      setHeight(entries[0].contentRect.height);
    });

    if (container.current?.parentElement) {
      obs.observe(container.current?.parentElement);
    }

    return  () => obs.disconnect()
  }, []);

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
    if (data) {
      list.current?.scrollToItem(data.logs.length - 1);
    }
  }, [data?.logs?.length]);

  // Render
  return (
    <Box ref={container} height="100%" pl={1}>
      <List
        ref={list}
        width="100%"
        height={height}
        itemSize={24}
        itemCount={data?.logs?.length || 0}
      >
        { ({ index: i, style }) => (
          <Log log={data!.logs[i]} style={style} />
        ) }
      </List>
    </Box>
  );
};
