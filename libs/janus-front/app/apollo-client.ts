import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SchemaLink } from '@apollo/client/link/schema';
import { GetServerSidePropsContext } from 'next';

// Client builder
export function createClient(ctx?: GetServerSidePropsContext): ApolloClient<NormalizedCacheObject> {
  const ssrMode = typeof window === 'undefined';

  // Build link
  let link: ApolloLink = new HttpLink({
    uri: '/graphql'
  });

  if (ssrMode) {
    if (ctx) {
      link = new SchemaLink({ schema: (ctx.req as any).schema });
    }
  } else {
    const wsLink = new WebSocketLink({
      uri: `${window.origin.replace(/^http/, 'ws')}/graphql`,
      options: {
        reconnect: true
      }
    });

    link = split(({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    }, wsLink, link);
  }

  // Build client
  return new ApolloClient({
    cache: new InMemoryCache(),
    link, ssrMode
  });
}
