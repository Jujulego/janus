import { useGraphql } from '@jujulego/alma-graphql';
import { ILog, IService, ServiceFragment } from '@jujulego/janus-types';
import { Box, Grid } from '@mui/material';
import { gql } from 'graphql.macro';
import { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ServiceHeader } from '../molecules/ServiceHeader';
import { Logs } from '../molecules/Logs';
import { ServiceGraph } from '../molecules/ServiceGraph';

// Types
export interface ServicePageData {
  service: IService;
}

// Component
const ServicePage: FC = () => {
  // Router
  const { name } = useParams<{ name: string }>();

  // State
  const [selected, setSelected] = useState<string>(name);

  // Api
  const { data } = useGraphql<ServicePageData>('/graphql', gql`
      query ServiceGraph($name: String!) {
          service(name: $name) {
              ...Service
          }
      }

      ${ServiceFragment}
  `, { name });

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
      </Grid>

      <Box mt={2} flex={1} minHeight={242}>
        <Logs title={`Logs of ${selected === name ? selected : [name, selected].join('.')}`} filter={filterLogs} />
      </Box>
    </>
  );
};

export default ServicePage;