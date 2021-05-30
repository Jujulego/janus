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
    '& .escape0': {
      color: palette.text.primary,
      background: palette.background.default
    },
    '& .escape1': {
      fontWeight: 'bold'
    },
    '& .escape3': {
      fontStyle: 'italic'
    },
    '& .escape4': {
      textDecoration: 'underline'
    },
    '& .escape30': {
      color: palette.common.black
    },
    '& .escape31': {
      color: red[700]
    },
    '& .escape32': {
      color: green[700]
    },
    '& .escape33': {
      color: yellow[700]
    },
    '& .escape34': {
      color: blue[700]
    },
    '& .escape35': {
      color: purple[700]
    },
    '& .escape36': {
      color: cyan[700]
    },
    '& .escape37': {
      color: palette.common.white
    },
    '& .escape40': {
      background: palette.common.black
    },
    '& .escape41': {
      background: red[700]
    },
    '& .escape42': {
      background: green[700]
    },
    '& .escape43': {
      background: yellow[700]
    },
    '& .escape44': {
      background: blue[700]
    },
    '& .escape45': {
      background: purple[700]
    },
    '& .escape46': {
      background: cyan[700]
    },
    '& .escape47': {
      background: palette.common.white
    },
    '& .escape90': {
      color: palette.grey[500]
    },
    '& .escape91': {
      color: red[300]
    },
    '& .escape92': {
      color: green[300]
    },
    '& .escape93': {
      color: yellow[300]
    },
    '& .escape94': {
      color: blue[300]
    },
    '& .escape95': {
      color: purple[300]
    },
    '& .escape96': {
      color: cyan[300]
    },
    '& .escape97': {
      color: palette.common.white
    },
    '& .escape100': {
      background: palette.grey[500]
    },
    '& .escape101': {
      background: red[300]
    },
    '& .escape102': {
      background: green[300]
    },
    '& .escape103': {
      background: yellow[300]
    },
    '& .escape104': {
      background: blue[300]
    },
    '& .escape105': {
      background: purple[300]
    },
    '& .escape106': {
      background: cyan[300]
    },
    '& .escape107': {
      background: palette.common.white
    }
  }
}));

// Props
export interface LogProps {
  log: ILog
}

// Component
export const Log: FC<LogProps> = ({ log }) => {
  // Memo
  const parts = useMemo(() => {
    return log.message.split('\x1b')
      .map((part, i) => {
        if (i === 0) return ['', part];

        const idx = part.indexOf('m');
        if (idx === -1) return ['', part];

        const codes = part.substr(1, idx - 1)
          .split(',')
          .map(code => `escape${code}`)
          .join(' ');

        return [codes, part.substr(idx + 1)];
      })
  }, [log]);

  // Render
  const styles = useStyles();

  return (
    <Typography className={clsx(styles.log, log.level)}>
      { parts.map(([cls, part]) => (
        <span className={cls}>{ part }</span>
      )) }
    </Typography>
  )
};
