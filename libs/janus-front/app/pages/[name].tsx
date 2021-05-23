import { gql } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';

import { IGate, IService, ServiceFragment } from '@jujulego/janus-common';

import { ServiceHeader } from '../services/ServiceHeader';
import { ServiceGraph } from '../services/ServiceGraph';
import { createClient } from '../apollo-client';
import { useCallback, useState } from 'react';
import { GateDetails } from '../gates/GateDetails';

// Types
export interface ServicePageData {
  service: IService;
}

// Page
const ServicePage: NextPage<ServicePageData> = ({ service }) => {
  // State
  const [gate, setGate] = useState<IGate | null>(null);

  // Callbacks
  const handleSelect = useCallback((name: string) => {
    const gate = service.gates.find(g => g.name === name);
    setGate(gate || null);
  }, [service, setGate]);

  // Render
  return (
    <Grid
      container direction="column"
      flexGrow={1} p={2}
    >
      <Grid item xs="auto">
        <ServiceHeader service={service}/>
      </Grid>

      <Grid item container spacing={2} xs>
        <Grid item xs>
          <ServiceGraph service={service} onSelect={handleSelect} />
        </Grid>

        { gate && (
          <Grid item xs="auto">
            <GateDetails gate={gate} />
          </Grid>
        ) }
      </Grid>
    </Grid>
  );
};

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
