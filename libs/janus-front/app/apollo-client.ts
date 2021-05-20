import { ApolloClient, InMemoryCache } from '@apollo/client';

// Client
export const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});
