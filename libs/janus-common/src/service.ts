import gql from 'graphql-tag';

import { GateFragment, IGate } from './gate';

// Model
export interface IService {
  // Attributes
  name: string;
  url: string;
  gates: IGate[];
}

// Fragment
export const ServiceFragment = gql`
    fragment Service on Service {
        name
        url
        
        gates {
            ...Gate
        }
    }
    
    ${GateFragment}
`;
