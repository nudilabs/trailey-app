import { router } from '../trpc';
import { getTxSummaryByChainAndTimeSpan } from './tx';

export const appRouter = router({
  getTxSummaryByChainAndTimeSpan
});

// export type definition of API
export type AppRouter = typeof appRouter;
