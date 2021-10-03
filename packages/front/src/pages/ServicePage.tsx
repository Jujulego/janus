import { useGraphql } from '@jujulego/alma-graphql';
import { IService, ServiceFragment } from '@jujulego/janus-types';
import { gql } from 'graphql.macro';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { ServiceHeader } from '../molecules/ServiceHeader';

// Types
export interface ServicePageData {
  service: IService;
}

// Component
export const ServicePage: FC = () => {
  // Router
  const { name } = useParams<{ name: string }>();

  // Api
  const { data } = useGraphql<ServicePageData>('/graphql', gql`
      query ServiceGraph($name: String!) {
          service(name: $name) {
              ...Service
          }
      }

      ${ServiceFragment}
  `, { name });

  // Render
  if (!data) {
    return null;
  }

  return (
    <ServiceHeader service={data.service} />
  );
};