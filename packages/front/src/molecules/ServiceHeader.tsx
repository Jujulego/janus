import { Grid, Paper, Typography } from '@mui/material';
import { FC } from 'react';

import { IService } from '@jujulego/janus-types';

// Types
export interface ServiceHeaderProps {
  service: IService;
}

// Component
export const ServiceHeader: FC<ServiceHeaderProps> = ({ service }) => (
  <Paper variant="outlined" sx={{ px: 2, pt: 1, pb: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Typography variant="caption" color="text.secondary">
          Service
        </Typography>
        <Typography>{service.name}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption" color="text.secondary">
          Url
        </Typography>
        <Typography>{service.url}</Typography>
      </Grid>
    </Grid>
  </Paper>
);
