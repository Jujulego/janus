import { gqlResource, gqlDoc, useGqlHttp, useGqlWs } from '@jujulego/alma-graphql';
import { GateFragment, IGate, ILog, IService, ServiceFragment } from '@jujulego/janus-types';
import { Box, Grid } from '@mui/material';
import { gql } from 'graphql.macro';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ServiceHeader } from '../molecules/ServiceHeader';
import { Logs } from '../molecules/Logs';
import { ServiceGraph } from '../molecules/ServiceGraph';
import { GateDetails } from '../molecules/GateDetails';

// Types
export interface ServicePageData {
  service: IService;
}

// Utils
function mergeGate(service: IService, gate?: IGate): IService {
  return {
    ...service,
    gates: service.gates.map((g) => g.name === gate?.name ? gate : g)
  };
}

// Api
const useServicePageData = gqlResource<ServicePageData, { name: string }>(useGqlHttp, '/graphql', gql`
    query ServiceGraph($name: String!) {
        service(name: $name) {
            ...Service
        }
    }

    ${ServiceFragment}
`)
  .query('enableGate', useGqlHttp, gqlDoc<{ enableGate: IGate }, { service: string, gate: string }>(gql`
      mutation EnableGate($service: String!, $gate: String!) {
          enableGate(service: $service, gate: $gate) {
              ...Gate
          }
      }
  
      ${GateFragment}
  `), (data, res) => data && ({ service: mergeGate(data.service, res?.enableGate) }))
  .query('disableGate', useGqlHttp, gqlDoc<{ disableGate: IGate }, { service: string, gate: string }>(gql`
      mutation DisableGate($service: String!, $gate: String!) {
          disableGate(service: $service, gate: $gate) {
              ...Gate
          }
      }
  
      ${GateFragment}
  `), (data, res) => data && ({ service: mergeGate(data.service, res?.disableGate) }))
  .subscribe('subscribe', useGqlWs, gqlDoc<ServicePageData, { name: string }>(gql`
      subscription ServiceGraph($name: String!) {
          service(name: $name) {
              ...Service
          }
      }
  
      ${ServiceFragment}
  `), (state, event) => event);

// Component
const ServicePage: FC = () => {
  // Router
  const { name = '' } = useParams<'name' | 'toto'>();

  // State
  const [selected, setSelected] = useState<string>(name);

  // Api
  const { data, enableGate, disableGate, subscribe } = useServicePageData({ name });

  // Memos
  const gate = useMemo(
    () => data && data.service.gates.find((g) => g.name === selected),
    [selected, data],
  );

  // Callbacks
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

  const toggleGate = useCallback(async (gate: IGate) => {
    if (gate.enabled) {
      await disableGate({ service: name, gate: gate.name });
    } else {
      await enableGate({ service: name, gate: gate.name });
    }
  }, [name, enableGate, disableGate]);

  // Effects
  useEffect(() => {
    return subscribe({ name });
  }, [subscribe, name]);

  // Render
  if (!data) {
    return null;
  }

  return (
    <>
      <ServiceHeader service={data.service} />

      <Grid container mt={2} flex={2} minHeight={400}>
        <Grid item xs>
          <ServiceGraph service={data.service} selected={selected} onSelect={setSelected} />
        </Grid>

        { gate && (
          <Grid item lg={2} minWidth={300} ml={2}>
            <GateDetails gate={gate} onToggle={toggleGate} />
          </Grid>
        ) }
      </Grid>

      <Box mt={2} flex={1} minHeight={242}>
        <Logs title={`Logs of ${selected === name ? selected : [name, selected].join('.')}`} filter={filterLogs} />
      </Box>
    </>
  );
};

export default ServicePage;