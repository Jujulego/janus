import { ApolloClient, InMemoryCache } from '@apollo/client';

// Client
export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});
