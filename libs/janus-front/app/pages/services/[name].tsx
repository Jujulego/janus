import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Grid } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GateFragment, IGate, ILog, IService, ServiceFragment } from '@jujulego/janus-common';

import { addApolloState, createApolloClient } from '../../apollo-client';
import { GateDetails } from '../../gates/GateDetails';
import { Navbar } from '../../layout/Navbar';
import { ServiceHeader } from '../../services/ServiceHeader';
import { ServiceGraph } from '../../services/ServiceGraph';
import { Logs, LOGS_QRY } from '../../control/Logs';

// Types
export interface ServicePageData {
  service: IService;
}

export interface ServicePageProps {
  name: string;
}

// Queries
const SERVICE_QRY = gql`
  query ServiceGraph($name: String!) {
    service(name: $name) {
      ...Service
    }
  }

  ${ServiceFragment}
`;

const SERVICE_SUB = gql`
  subscription ServiceGraph($name: String!) {
    service(name: $name) {
      ...Service
    }
  }

  ${ServiceFragment}
`;

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

// Page
const ServicePage: NextPage<ServicePageProps> = ({ name }) => {
  // State
  const [selected, setSelected] = useState<string>(name);

  // Queries
  const { data, subscribeToMore } = useQuery<ServicePageData>(SERVICE_QRY, {
    variables: { name },
  });

  const [enableGate] = useMutation<{ enableGate: IGate }>(ENABLE_GATE_MUT);
  const [disableGate] = useMutation<{ disableGate: IGate }>(DISABLE_GATE_MUT);

  // Memos
  const gate = useMemo(
    () => data && data.service.gates.find((g) => g.name === selected),
    [selected, data],
  );

  // Callbacks
  const handleToggle = useCallback(async (gate: IGate) => {
    if (gate.enabled) {
      await disableGate({ variables: { service: name, gate: gate.name } });
    } else {
      await enableGate({ variables: { service: name, gate: gate.name } });
    }
  }, [name, enableGate, disableGate]);

  const filterLogs = useCallback((log: ILog) => {
    if (data) {
      if (log.metadata.service !== data.service.name) {
        return false;
      }

      if (gate) {
        return log.metadata.gate === gate.name;
      }
    }

    return true;
  }, [data, gate]);

  // Effects
  useEffect(() => {
    subscribeToMore({
      document: SERVICE_SUB,
      variables: { name },
      updateQuery: (prev, { subscriptionData }) => {
        return subscriptionData.data;
      },
    });
  }, [subscribeToMore, name]);

  useEffect(() => {
    setSelected(name);
  }, [name]);

  // Render
  return (
    <Navbar>
      { data && (
        <>
          <ServiceHeader service={data.service} />

          <Grid container mt={2} flex={2} minHeight={400}>
            <Grid item xs>
              <ServiceGraph service={data.service} selected={selected} onSelect={setSelected} />
            </Grid>

            { gate && (
              <Grid item lg={2} minWidth={300} ml={2}>
                <GateDetails gate={gate} onToggle={handleToggle} />
              </Grid>
            ) }
          </Grid>

          <Box mt={2} flex={1} minHeight={200}>
            <Logs title={`Logs of ${selected === name ? selected : [name, selected].join('.')}`} filter={filterLogs} />
          </Box>
        </>
      ) }
    </Navbar>
  );
};

export default ServicePage;

// Server Side
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = createApolloClient(ctx);
  const { name } = ctx.params!;

  // Request service
  await client.query<ServicePageData>({
    query: SERVICE_QRY,
    variables: { name },
  });

  await client.query({
    query: LOGS_QRY
  });

  return { props: addApolloState(client, { name }) };
};
