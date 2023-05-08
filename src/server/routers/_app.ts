import { createTRPCRouter } from '../trpc';
import { txsRouter } from './txs';

export const appRouter = createTRPCRouter({
  txs: txsRouter
  // getTxSummary,
  // getTxSummaryGroupByDay
});

// export type definition of API
export type AppRouter = typeof appRouter;
