import { createTRPCRouter } from '@/server/trpc';
import { getSummary, getSummaryByDay } from './getSummary';
import { syncWalletTxs } from './syncWalletTxs';

export const txsRouter = createTRPCRouter({
  getSummary,
  getSummaryByDay,
  syncWalletTxs
});
