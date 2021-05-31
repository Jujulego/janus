import { makeStyles, Typography } from '@material-ui/core';
import { blue, cyan, green, purple, red, yellow } from '@material-ui/core/colors';
import { FC, useMemo } from 'react';
import clsx from 'clsx';

import { ILog } from '@jujulego/janus-common';

// Styles
const useStyles = makeStyles(({ palette }) => ({
  log: {
    '&.verbose': {
      color: cyan[700],
    },
    '&.warn': {
      color: yellow[700],
    },
    '&.error': {
      color: red[700],
    },
    '& .e-0': {
      color: palette.text.primary,
      background: palette.background.default
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
      color: palette.common.black
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
      color: palette.common.white
    },
    '& .e-40': {
      background: palette.common.black
    },
    '& .e-41': {
      background: red[700]
    },
    '& .e-42': {
      background: green[700]
    },
    '& .e-43': {
      background: yellow[700]
    },
    '& .e-44': {
      background: blue[700]
    },
    '& .e-45': {
      background: purple[700]
    },
    '& .e-46': {
      background: cyan[700]
    },
    '& .e-47': {
      background: palette.common.white
    },
    '& .e-90': {
      color: palette.grey[500]
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
      color: palette.common.white
    },
    '& .e-100': {
      background: palette.grey[500]
    },
    '& .e-101': {
      background: red[300]
    },
    '& .e-102': {
      background: green[300]
    },
    '& .e-103': {
      background: yellow[300]
    },
    '& .e-104': {
      background: blue[300]
    },
    '& .e-105': {
      background: purple[300]
    },
    '& .e-106': {
      background: cyan[300]
    },
    '& .e-107': {
      background: palette.common.white
    }
  }
}));

// Types
export interface LogProps {
  log: ILog
}

export interface EscapeCode {
  s?: number[];
  f?: number;
  b?: number;
}

// Component
export const Log: FC<LogProps> = ({ log }) => {
  // Memo
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
  const styles = useStyles();

  return (
    <Typography className={clsx(styles.log, log.level)}>
      { parts.map(([cls, part], i) => (
        <span key={i} className={cls}>{ part }</span>
      )) }
    </Typography>
  );
};
