import { Paper } from '@material-ui/core';
import { FC } from 'react';

import { IGate } from '@jujulego/janus-common';

// Props
export interface GateDetailsProps {
  gate: IGate;
}

// Component
export const GateDetails: FC<GateDetailsProps> = ({ gate }) => (
  <Paper variant="outlined" sx={{ height: '100%', width: 300, p: 2 }}>
    { gate.name }
  </Paper>
);
