import { ILog } from '@jujulego/janus-types';
import { Typography } from '@mui/material';
import { blue, cyan, green, purple, red, yellow } from '@mui/material/colors';
import { CSSProperties, FC, useMemo } from 'react';
import clsx from 'clsx';

import { levelsColors } from '../levels';

// Types
export interface LogProps {
  log: ILog;
  style?: CSSProperties;
}

export interface EscapeCode {
  s?: number[];
  f?: number;
  b?: number;
}

// Component
export const Log: FC<LogProps> = ({ log, style }) => {
  // Memos
  const parts = useMemo(() => {
    const result: [string, string][] = [];
    let state: EscapeCode = {};

    for (const part of log.message.split('\x1b')) {
      if (result.length === 0) {
        result.push(['', part]);
        continue;
      }

      // Parse code
      const end = part.indexOf('m');
      const msg = part.substr(end + 1);
      const codes = part.substr(1, end - 1).split(',').map(c => parseInt(c));

      if (codes.includes(0)) {
        state = {};
        result.push(['e-0', msg]);
      } else {
        for (const code of codes) {
          if ((code >= 30 && code <= 37) || (code >= 90 && code <= 97)) {
            state.f = code;
          } else if ((code >= 40 && code <= 47) || (code >= 100 && code <= 107)) {
            state.b = code;
          } else {
            state.s = [...state.s || [], code];
          }
        }

        result.push([
          clsx(state.f && `e-${state.f}`, state.b && `e-${state.b}`, state.s?.map(c => `e-${c}`)),
          msg
        ]);
      }
    }

    return result;
  }, [log]);

  // Render
  return (
    <Typography
      className={log.level}
      style={style}
      sx={{

        overflow: 'hidden',
        textOverflow: 'ellispsis',
        whiteSpace: 'nowrap',

        '&.debug': {
          color: levelsColors.debug,
        },
        '&.verbose': {
          color: levelsColors.verbose,
        },
        '&.warn': {
          color: levelsColors.warn,
        },
        '&.error': {
          color: levelsColors.error,
        },
        '& .e-0': {
          color: 'text.primary',
          bgcolor: 'background.default'
        },
        '& .e-1': {
          fontWeight: 'bold'
        },
        '& .e-3': {
          fontStyle: 'italic'
        },
        '& .e-4': {
          textDecoration: 'underline'
        },
        '& .e-30': {
          color: 'common.black'
        },
        '& .e-31': {
          color: red[700]
        },
        '& .e-32': {
          color: green[700]
        },
        '& .e-33': {
          color: yellow[700]
        },
        '& .e-34': {
          color: blue[700]
        },
        '& .e-35': {
          color: purple[700]
        },
        '& .e-36': {
          color: cyan[700]
        },
        '& .e-37': {
          color: 'common.white'
        },
        '& .e-40': {
          bgcolor: 'common.black'
        },
        '& .e-41': {
          bgcolor: red[700]
        },
        '& .e-42': {
          bgcolor: green[700]
        },
        '& .e-43': {
          bgcolor: yellow[700]
        },
        '& .e-44': {
          bgcolor: blue[700]
        },
        '& .e-45': {
          bgcolor: purple[700]
        },
        '& .e-46': {
          bgcolor: cyan[700]
        },
        '& .e-47': {
          bgcolor: 'common.white'
        },
        '& .e-90': {
          color: 'grey.500'
        },
        '& .e-91': {
          color: red[300]
        },
        '& .e-92': {
          color: green[300]
        },
        '& .e-93': {
          color: yellow[300]
        },
        '& .e-94': {
          color: blue[300]
        },
        '& .e-95': {
          color: purple[300]
        },
        '& .e-96': {
          color: cyan[300]
        },
        '& .e-97': {
          color: 'common.white'
        },
        '& .e-100': {
          bgcolor: 'grey.500'
        },
        '& .e-101': {
          bgcolor: red[300]
        },
        '& .e-102': {
          bgcolor: green[300]
        },
        '& .e-103': {
          bgcolor: yellow[300]
        },
        '& .e-104': {
          bgcolor: blue[300]
        },
        '& .e-105': {
          bgcolor: purple[300]
        },
        '& .e-106': {
          bgcolor: cyan[300]
        },
        '& .e-107': {
          bgcolor: 'common.white'
        }
      }}
    >
      { log.metadata.context && (
        <span className="e-90">[{ log.metadata.context }] </span>
      ) }
      { parts.map(([cls, part], i) => (
        <span key={i} className={cls}>{ part }</span>
      )) }
    </Typography>
  );
};
