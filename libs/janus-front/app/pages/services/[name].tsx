import { gql, useMutation, useSubscription } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GateFragment, IGate, IService, ServiceFragment } from '@jujulego/janus-common';

import { addApolloState, createApolloClient } from '../../apollo-client';
import { GateDetails } from '../../gates/GateDetails';
import { Navbar } from '../../layout/Navbar';
import { ServiceHeader } from '../../services/ServiceHeader';
import { ServiceGraph } from '../../services/ServiceGraph';

// Types
export interface ServicePageData {
  service: IService;
}

// Queries
const ENABLE_GATE_MUT = gql`
    mutation EnableGate($service: String!, $gate: String!) {
        enableGate(service: $service, gate: $gate) {
            ...Gate
        }
    }
    
    ${GateFragment}
`;

const DISABLE_GATE_MUT = gql`
    mutation DisableGate($service: String!, $gate: String!) {
        disableGate(service: $service, gate: $gate) {
            ...Gate
        }
    }
    
    ${GateFragment}
`;

const SERVICE_SUB = gql`
    subscription ServiceGraph($service: String!) {
        service(name: $service) {
            ...Service
        }
    }

    ${ServiceFragment}
`;

// Page
const ServicePage: NextPage<ServicePageData> = (props) => {
  // State
  const [service, setService] = useState(props.service);
  const [selected, setSelected] = useState<string>("");

  // Memos
  const gate = useMemo(() => service.gates.find(g => g.name === selected), [selected, service])

  // Queries
  useSubscription<ServicePageData>(SERVICE_SUB, {
    variables: { service: props.service.name },
    onSubscriptionData: ({ subscriptionData }) => subscriptionData.data && setService(subscriptionData.data.service)
  });

  const [enableGate] = useMutation<{ enableGate: IGate }>(ENABLE_GATE_MUT);
  const [disableGate] = useMutation<{ disableGate: IGate }>(DISABLE_GATE_MUT);

  // Callbacks
  const handleToggle = useCallback(async (gate: IGate) => {
    if (gate.enabled) {
      await disableGate({ variables: { service: service.name, gate: gate.name }});
    } else {
      await enableGate({ variables: { service: service.name, gate: gate.name } });
    }
  }, [service, setService]);

  // Effects
  useEffect(() => {
    setService(props.service);
  }, [props.service]);

  // Render
  return (
    <Navbar>
      <ServiceHeader service={service} />

      <Grid container mt={2} flexGrow={1}>
        <Grid item xs>
          <ServiceGraph service={service} onSelect={setSelected} />
        </Grid>

        { gate && (
          <Grid item lg={2} minWidth={300} ml={2}>
            <GateDetails gate={gate} onToggle={handleToggle} />
          </Grid>
        ) }
      </Grid>
    </Navbar>
  );
};

export default ServicePage;

// Server Side
export const getServerSideProps: GetServerSideProps<ServicePageData> = async (ctx) => {
  const client = createApolloClient(ctx);
  const { name } = ctx.params!;

  const { data } = await client.query<ServicePageData>({
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

  return { props: addApolloState(client, data) };
};
