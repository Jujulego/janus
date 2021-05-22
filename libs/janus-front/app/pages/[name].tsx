import { gql } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';

import { IService, ServiceFragment } from '@jujulego/janus-common';

import { ServiceHeader } from '../services/ServiceHeader';
import { ServiceGraph } from '../services/ServiceGraph';
import { createClient } from '../apollo-client';

// Types
export interface ServicePageData {
  service: IService;
}

// Page
const ServicePage: NextPage<ServicePageData> = ({ service }) => (
  <Grid
    container direction="column"
    p={2}
    flexGrow={1}
  >
    <Grid item xs="auto">
      <ServiceHeader service={service} />
    </Grid>

    <Grid item xs>
      <ServiceGraph service={service} />
    </Grid>
  </Grid>
);

export default ServicePage;

// Server Side
export const getServerSideProps: GetServerSideProps<ServicePageData> = async (ctx) => {
  const { name } = ctx.params!;

  const { data } = await createClient(ctx).query<ServicePageData>({
    query: gql`
        query ServicePage($name: String!) {
            service(name: $name) {
                ...Service
            }
        }

        ${ServiceFragment}
    `,
    variables: { name }
  });

  return { props: data };
};
