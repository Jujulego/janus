import { gql, useMutation } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GateFragment, IGate, IService, ServiceFragment } from '@jujulego/janus-common';

import { ServiceHeader } from '../../services/ServiceHeader';
import { ServiceGraph } from '../../services/ServiceGraph';
import { createClient } from '../../apollo-client';
import { GateDetails } from '../../gates/GateDetails';

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

// Page
const ServicePage: NextPage<ServicePageData> = (props) => {
  // State
  const [service, setService] = useState(props.service);
  const [selected, setSelected] = useState<string>("");

  // Memos
  const gate = useMemo(() => service.gates.find(g => g.name === selected), [selected, service])

  // Queries
  const [enableGate] = useMutation<{ enableGate: IGate }>(ENABLE_GATE_MUT);
  const [disableGate] = useMutation<{ disableGate: IGate }>(DISABLE_GATE_MUT);

  // Callbacks
  const handleToggle = useCallback(async (gate: IGate) => {
    let res: IGate;

    if (gate.enabled) {
      const { data } = await disableGate({ variables: { service: service.name, gate: gate.name }});
      res = data!.disableGate;
    } else {
      const { data } = await enableGate({ variables: { service: service.name, gate: gate.name } });
      res = data!.enableGate;
    }

    setService((srv) => ({ ...srv, gates: srv.gates.map((g) => g.name === gate.name ? res : g) }));
  }, [service, setService]);

  // Effects
  useEffect(() => {
    setService(props.service);
  }, [props.service]);

  // Render
  return (
    <>
      <ServiceHeader service={service} />

      <Grid container xs mt={2} flexGrow={1}>
        <Grid item xs>
          <ServiceGraph service={service} onSelect={setSelected} />
        </Grid>

        { gate && (
          <Grid item lg={2} minWidth={300} ml={2}>
            <GateDetails gate={gate} onToggle={handleToggle} />
          </Grid>
        ) }
      </Grid>
    </>
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
