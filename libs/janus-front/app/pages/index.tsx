import { gql, useQuery } from '@apollo/client';
import { Card, CardHeader, Grid, IconButton, Typography } from '@material-ui/core';
import { Share as ShareIcon } from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';

import { IService } from '@jujulego/janus-common';

import { addApolloState, createApolloClient } from '../apollo-client';
import { Logs } from '../control/Logs';
import { Navbar } from '../layout/Navbar';

// Queries
const HOME_PAGE_QRY = gql`
    query HomePage {
        services {
            name
            url
        }
    }
`;

// Types
export interface HomePageData {
  services: Pick<IService, 'name' | 'url'>[];
}

// Page
const HomePage: NextPage = () => {
  // Queries
  const { data } = useQuery<HomePageData>(HOME_PAGE_QRY);

  // Render
  return (
    <Navbar>
      <Typography variant="h5" mb={2}>Services</Typography>

      <Grid container spacing={2}>
        { data?.services.map((service) => (
          <Grid key={service.name} item xs={4} md={3} xl={2}>
            <Card>
              <CardHeader
                title={service.name}
                titleTypographyProps={{ variant: 'body1' }}

                subheader={service.url}
                subheaderTypographyProps={{ variant: 'body2', color: 'primary.light' }}

                action={
                  <NextLink href={`/services/${service.name}`} passHref>
                    <IconButton component="a">
                      <ShareIcon/>
                    </IconButton>
                  </NextLink>
                }
              />
            </Card>
          </Grid>
        )) }
      </Grid>

      <Typography variant="h5" mt={4} mb={2}>Events</Typography>
      <Logs />
    </Navbar>
  );
};

export default HomePage;

// Server Side
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = createApolloClient(ctx);

  // Request services data
  await client.query<HomePageData>({
    query: HOME_PAGE_QRY
  });

  return { props: addApolloState(client, {}) };
};
