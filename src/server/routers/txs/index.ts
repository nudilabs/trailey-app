import { createTRPCRouter } from '@/server/trpc';
import {
  getSummary,
  getSummaryByContract,
  getSummaryByMonth
} from './getSummary';
import { syncWalletTxs } from './syncWalletTxs';

export const txsRouter = createTRPCRouter({
  getSummary,
  getSummaryByMonth,
  syncWalletTxs,
  getSummaryByContract
});
