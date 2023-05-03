import { router } from '../trpc';
import { getTxCountByChainAndTimeSpan } from './tx';

export const appRouter = router({
  getTxCountByChainAndTimeSpan
});

// export type definition of API
export type AppRouter = typeof appRouter;
