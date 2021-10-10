import { gqlDoc, gqlResource } from '@jujulego/alma-graphql';
import { ILog, LogFragment } from '@jujulego/janus-types';
import { Box, Chip, Paper, Stack, Toolbar, Typography } from '@mui/material';
import TollIcon from '@mui/icons-material/Toll';
import { gql } from 'graphql.macro';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

import { LevelChip } from '../atoms/LevelChip';
import { Log } from '../atoms/Log';

// Types
interface LogsData {
  logs: ILog[];
}

export interface LogsProps {
  title?: string;
  filter?: (log: ILog) => boolean;
}

// Api
const useLogsData = gqlResource<LogsData>('/graphql', gql`
    query Logs {
        logs {
            ...Log
        }
    }

    ${LogFragment}
`)
  .subscription('subscribe', gqlDoc<{ logs: ILog }>(gql`
      subscription Logs {
          logs {
              ...Log
          }
      }
  
      ${LogFragment}
  `), (state, event) => state && { logs: [...state.logs, event.logs] });

// Component
export const Logs: FC<LogsProps> = ({ title, filter }) => {
  // Query logs
  const { data, subscribe } = useLogsData({});

  // State
  const [levels, setLevels] = useState<string[]>(['error', 'warn', 'info', 'verbose', 'debug']);
  const [height, setHeight] = useState(192); // 8 lines of 24px

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

  const toggleAll = useCallback(() => {
    setLevels((old) => old.length > 0 ? [] : ['error', 'warn', 'info', 'verbose', 'debug']);
  }, []);

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
    return subscribe({});
  }, [subscribe]);

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
          <Chip icon={<TollIcon />} label="All" onClick={toggleAll} />
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
