import { z } from 'zod';
import { procedure } from '../trpc';
import { db } from '@/db/drizzle-db';
import { supportChains, transactions } from '@/db/schema';
import { and, eq, InferModel, sql } from 'drizzle-orm';
import { getEthFromGwei, getEthFromWei } from '@/utils/format';

export const getTxSummaryByChainAndTimeSpan = procedure
  .input(
    z.object({
      chainName: z.string(),
      walletAddr: z.string(),
      timeSpan: z.number().positive()
    })
  )
  .query(async opts => {
    const { chainName, walletAddr, timeSpan } = opts.input;
    const supportedChain = await db
      .select()
      .from(supportChains)
      .where(eq(supportChains.name, chainName));
    if (supportedChain.length === 0)
      return {
        txCount: '0',
        contractCount: '0',
        txValueSum: '0',
        feesPaidSum: '0',
        message: `Chain ${chainName} is not supported`
      };

    const chainId = supportedChain[0].id;
    const data = await db
      .select({
        txCount: sql`count(tx_hash)`,
        contractCount: sql`count(case when is_interact then 1 else null end)`,
        valueSum: sql`sum(value_quote)`,
        feesPaidSum: sql`sum(fees_paid)` // CHECK THIS, does it include failed TXs?
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL ${timeSpan} DAY)`,
          eq(transactions.fromAddress, walletAddr),
          eq(transactions.success, true)
        )
      );
    return {
      txCount: data[0].txCount,
      contractCount: data[0].contractCount,
      txValueSum: data[0].valueSum,
      feesPaidSum: data[0].feesPaidSum,
      message: `Found ${data[0].txCount} transactions and ${data[0].contractCount} contract interactions for chain ${supportedChain[0].name} in the last ${timeSpan} days.`
    };
  });
