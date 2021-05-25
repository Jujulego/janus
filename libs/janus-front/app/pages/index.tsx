import { gql } from '@apollo/client';
import { Box, Card, CardHeader, Grid, IconButton, Typography } from '@material-ui/core';
import { Share as ShareIcon } from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';

import { IService } from '@jujulego/janus-common';

import { createClient } from '../apollo-client';

// Types
export interface HomePageData {
  services: Pick<IService, 'name' | 'url'>[];
}

// Page
const HomePage: NextPage<HomePageData> = ({ services }) => (
  <Box p={2}>
    <Typography variant="h5" mb={2}>Services</Typography>
    <Grid container spacing={2}>
      { services.map((service) => (
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
                    <ShareIcon />
                  </IconButton>
                </NextLink>
              }
            />
          </Card>
        </Grid>
      )) }
    </Grid>
  </Box>
);

export default HomePage;

// Server Side
export const getServerSideProps: GetServerSideProps<HomePageData> = async (ctx) => {
  const { data } = await createClient(ctx).query<HomePageData>({
    query: gql`
        query HomePage {
            services {
                name
                url
            }
        }
    `
  });

  return { props: data };
};
