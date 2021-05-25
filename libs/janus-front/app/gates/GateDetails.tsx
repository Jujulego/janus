import { Box, Chip, Divider, Grid, Paper, Stack, Switch, Typography } from '@material-ui/core';
import { FC, useCallback } from 'react';

import { IGate } from '@jujulego/janus-common';

// Props
export interface GateDetailsProps {
  gate: IGate;
  onToggle: (gate: IGate) => void;
}

// Utils
const OptionChip: FC<{ label: string, active: boolean }> = ({ label, active }) => (
  <Chip
    label={label} size="small"
    variant={active ? 'filled' : 'outlined'}
    color={active ? 'primary' : 'default'}
  />
);

// Component
export const GateDetails: FC<GateDetailsProps> = ({ gate, onToggle }) => {
  // Callbacks
  const handleToggle = useCallback(() => {
    onToggle(gate);
  }, [gate]);

  // Render
  return (
    <Paper variant="outlined" sx={{ height: '100%' }}>
      <Grid container sx={{ px: 2, pt: 1.5 }}>
        <Grid item xs>
          <Typography variant="caption" color="text.secondary">Gate</Typography>
          <Typography>{ gate.name }</Typography>
        </Grid>
        <Grid item xs="auto" alignSelf="center">
          <Switch checked={gate.enabled} onChange={handleToggle}/>
        </Grid>
      </Grid>
      <Divider orientation="horizontal" sx={{ mt: 1.5 }} />
      <Box mt={1.5} px={2}>
        <Typography variant="caption" color="text.secondary">Target</Typography>
        <Typography>{ gate.target }</Typography>
      </Box>
      <Box mt={1.5} px={2}>
        <Typography variant="caption" color="text.secondary">Priority</Typography>
        <Typography>{ gate.priority }</Typography>
      </Box>
      <Box mt={1.5} px={2}>
        <Typography variant="caption" color="text.secondary">Options</Typography>
        <Stack direction="row" spacing={1}>
          <OptionChip label="changeOrigin" active={gate.changeOrigin} />
          <OptionChip label="secure" active={gate.secure} />
          <OptionChip label="ws" active={gate.ws} />
        </Stack>
      </Box>
    </Paper>
  );
};
