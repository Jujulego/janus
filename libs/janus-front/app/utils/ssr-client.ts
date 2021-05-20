import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { GetServerSidePropsContext } from 'next';

// Utils
export function getSSRClient(ctx: GetServerSidePropsContext): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema: (ctx.req as any).schema }),
    ssrMode: true
  });
}
