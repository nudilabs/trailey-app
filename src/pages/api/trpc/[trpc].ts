import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';
import { appRouter } from '../../../server/routers/_app';

export const config = {
  runtime: 'edge'
};

// export API handler
export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: () => ({})
  });
}
