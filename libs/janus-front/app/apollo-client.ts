import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SchemaLink } from '@apollo/client/link/schema';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';

// Constants
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

// Utils
let _apolloClient: ApolloClient<NormalizedCacheObject>;

export function createApolloClient(ctx?: GetServerSidePropsContext): ApolloClient<NormalizedCacheObject> {
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
    link, ssrMode,
    cache: new InMemoryCache({
      typePolicies: {
        Service: {
          keyFields: ["name"]
        }
      }
    })
  });
}

export function addApolloState<P>(client: ApolloClient<NormalizedCacheObject>, props: P): P & { [APOLLO_STATE_PROP_NAME]: NormalizedCacheObject } {
  return {
    ...props,
    [APOLLO_STATE_PROP_NAME]: client.cache.extract()
  };
}

export function useApolloClient(pageProps: any): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME] as NormalizedCacheObject | undefined;

  return useMemo(() => {
    const apolloClient = _apolloClient ?? createApolloClient();

    if (state) {
      const existing = apolloClient.cache.extract();

      const data = merge(state, existing, {
        // combine arrays using object equality (like in sets)
        arrayMerge: (destinationArray, sourceArray) => [
          ...sourceArray,
          ...destinationArray.filter((d) =>
            sourceArray.every((s) => !isEqual(d, s))
          ),
        ],
      });

      apolloClient.cache.restore(data);
    }

    if (typeof window === 'undefined') return apolloClient;
    if (!_apolloClient) _apolloClient = apolloClient;

    return apolloClient;
  }, [state]);
}
