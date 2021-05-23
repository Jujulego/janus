import { Grid, Paper, Typography } from '@material-ui/core';
import { FC } from 'react';

import { IService } from '@jujulego/janus-common';

// Types
export interface ServiceHeaderProps {
  service: IService;
}

// Component
export const ServiceHeader: FC<ServiceHeaderProps> = ({ service }) => (
  <Paper variant="outlined">
    <Grid container px={2} pt={1} pb={2} spacing={2}>
      <Grid item xs={4}>
        <Typography variant="caption" color="text.secondary">Service</Typography>
        <Typography>{ service.name }</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption" color="text.secondary">Url</Typography>
        <Typography>{ service.url }</Typography>
      </Grid>
    </Grid>
  </Paper>
);
