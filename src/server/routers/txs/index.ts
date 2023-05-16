import { createTRPCRouter } from '@/server/trpc';
import { getSummary, getSummaryByContract } from './getSummary';
import { syncWalletTxs } from './syncWalletTxs';

export const txsRouter = createTRPCRouter({
  getSummary,

  syncWalletTxs,
  getSummaryByContract
});
