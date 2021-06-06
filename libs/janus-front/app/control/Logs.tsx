import { gql, useQuery } from '@apollo/client';
import { Box, Paper, Stack, Toolbar, Typography } from '@material-ui/core';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import ResizeObserver from 'resize-observer-polyfill';

import { ILog, LogFragment } from '@jujulego/janus-common';

import { LevelChip } from './LevelChip';
import { Log } from './Log';

// Types
interface LogsData {
  logs: ILog[];
}

interface LogsEvent {
  logs: ILog;
}

export interface LogsProps {
  title?: string;
  filter?: (log: ILog) => boolean;
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
export const Logs: FC<LogsProps> = ({ title, filter }) => {
  // Query logs
  const { data, subscribeToMore } = useQuery<LogsData>(LOGS_QRY);

  // State
  const [levels, setLevels] = useState<string[]>(['error', 'warn', 'info', 'verbose', 'debug']);
  const [height, setHeight] = useState(200);

  // Ref
  const container = useRef<HTMLDivElement>(null);
  const list = useRef<List>(null);

  // Callbacks
  const toggleLevel = useCallback((level: string) => () => {
    setLevels((old) => {
      if (old.includes(level)) {
        return old.filter((lvl) => lvl !== level);
      } else {
        return [...old, level];
      }
    });
  }, [setLevels]);

  // Memos
  const logs = useMemo(() => {
    if (!data) return [];

    let logs = data.logs;
    logs = logs.filter(log => levels.includes(log.level));

    if (filter) {
      logs = logs.filter(filter);
    }

    return logs;
  }, [data, levels, filter]);

  // Effects
  useEffect(() => {
    const obs = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      setHeight(entries[0].contentRect.height);
    });

    if (container.current) {
      obs.observe(container.current);
    }

    return  () => obs.disconnect();
  }, []);

  useEffect(() => {
    subscribeToMore<LogsEvent>({
      document: LOGS_SUB,
      updateQuery: (prev, { subscriptionData }) => ({
        ...prev,
        logs: [...prev.logs || [], subscriptionData.data.logs]
      })
    });
  }, [subscribeToMore]);

  useEffect(() => {
    if (logs.length > 0) {
      list.current?.scrollToItem(logs.length - 1);
    }
  }, [logs.length]);

  // Render
  return (
    <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar variant="dense" disableGutters sx={{ px: 1 }}>
        <Typography variant="h6" sx={{ flex: 1, ml: 1 }}>{ title }</Typography>
        <Stack direction="row" spacing={1}>
          <LevelChip
            level="error"
            enabled={levels.includes('error')}
            onToggle={toggleLevel('error')}
          />
          <LevelChip
            level="warn"
            enabled={levels.includes('warn')}
            onToggle={toggleLevel('warn')}
          />
          <LevelChip
            level="info"
            enabled={levels.includes('info')}
            onToggle={toggleLevel('info')}
          />
          <LevelChip
            level="verbose"
            enabled={levels.includes('verbose')}
            onToggle={toggleLevel('verbose')}
          />
          <LevelChip
            level="debug"
            enabled={levels.includes('debug')}
            onToggle={toggleLevel('debug')}
          />
        </Stack>
      </Toolbar>
      <Box ref={container} pl={1} flex={1} maxHeight="calc(100% - 48px)">
        <List
          ref={list}
          width="100%"
          height={height}
          itemSize={24}
          itemCount={logs.length}
        >
          { ({ index: i, style }) => (
            <Log log={logs[i]} style={style} />
          ) }
        </List>
      </Box>
    </Paper>
  );
};
