import { router } from '../trpc';
import { getTxSummary, getTxSummaryGroupByDay } from './tx';

export const appRouter = router({
  getTxSummary,
  getTxSummaryGroupByDay
});

// export type definition of API
export type AppRouter = typeof appRouter;
