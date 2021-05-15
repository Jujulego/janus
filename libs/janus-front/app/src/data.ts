import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { DataService } from '@jujulego/janus-common';

// Utils
export function getDataService<Q extends ParsedUrlQuery>(ctx: GetServerSidePropsContext<Q>): DataService {
  return (ctx.req as any).janusData as DataService;
}
