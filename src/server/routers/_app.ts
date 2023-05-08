import { router } from '../trpc';
import { getTxSummary, getTxSummaryGroupByDay } from './txs';

export const appRouter = router({
  getTxSummary,
  getTxSummaryGroupByDay
});

// export type definition of API
export type AppRouter = typeof appRouter;
