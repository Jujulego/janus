import { gql, useQuery } from '@apollo/client';
import { Grid, List, ListItem, ListItemText, ListSubheader, Paper } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { GateFragment, IService, ServiceFragment } from '@jujulego/janus-common';

import { ServiceHeader } from '../services/ServiceHeader';
import { ServiceGraph } from '../services/ServiceGraph';

// Page
const HomePage: NextPage = () => {
  // GraphQL
  const { data: { services } = { services: [] } } = useQuery<{ services: IService[] }>(gql`
      query HomePage {
          services {
              ...Service
      
              gates {
                  ...Gate
              }
          }
      }
      
      ${ServiceFragment}
      ${GateFragment}
  `);

  // Contexts
  const router = useRouter();

  // Memos
  const service = useMemo(() => {
    return services.find((srv) => srv.name === router.query.service);
  }, [services, router.query]);

  // Render
  return (
    <Grid container sx={{ flex: 1 }}>
      <Grid item xs={2}>
        <Paper square sx={{ height: '100%' }}>
          <List
            component="nav"
            subheader={
              <ListSubheader component="span" sx={{ bgcolor: 'transparent' }}>
                Services
              </ListSubheader>
            }
          >
            { services.map((service) => (
              <Link key={service.name} href={`/?service=${service.name}`} shallow passHref>
                <ListItem button component="a">
                  <ListItemText
                    primary={service.name}
                    secondary={service.url}
                    secondaryTypographyProps={{ color: 'primary.light' }}
                  />
                </ListItem>
              </Link>
            )) }
          </List>
        </Paper>
      </Grid>
      { service && (
        <Grid
          item xs
          container direction="column"
          p={2}
        >
          <Grid item xs="auto">
            <ServiceHeader service={service} />
          </Grid>

          <Grid item xs>
            <ServiceGraph service={service} />
          </Grid>
        </Grid>
      ) }
    </Grid>
  );
};

export default HomePage;
