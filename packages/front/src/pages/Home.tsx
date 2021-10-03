import { useGraphql } from '@jujulego/alma-graphql';
import { IService } from '@jujulego/janus-types';
import { Box, Card, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { gql } from 'graphql.macro';
import { FC } from 'react';

// Types
interface HomeData {
  services: Pick<IService, 'name' | 'url'>[];
}

// Component
export const Home: FC = () => {
  // Api
  const { data } = useGraphql<HomeData>('http://localhost:5000/graphql', gql`
      query Home {
          services {
              name
              url
          }
      }
  `, {});

  return (
    <Box component="section" p={2}>
      <Typography variant="h5" mb={2}>Services</Typography>
      <Grid container spacing={2}>
        { data?.services.map((service) => (
          <Grid key={service.name} item xs={4} md={3} xl={2}>
            <Card>
              <CardHeader
                title={service.name}
                titleTypographyProps={{ variant: 'body1' }}

                subheader={service.url}
                subheaderTypographyProps={{
                  variant: 'body2',
                  color: 'primary.light',
                }}

                action={
                  <IconButton component="a">
                    <ShareIcon />
                  </IconButton>
                }
              />
            </Card>
          </Grid>
        )) }
      </Grid>
    </Box>
  );
};