import { z } from 'zod';
import { procedure } from '../trpc';
import { db } from '@/db/drizzle-db';
import { supportChains, transactions } from '@/db/schema';
import { and, eq, InferModel, sql } from 'drizzle-orm';

export const getTxCountByChainAndTimeSpan = procedure
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
    console.log(supportedChain);
    if (supportedChain.length === 0)
      return {
        message: `Chain ${chainName} is not supported`
      };

    const chainId = supportedChain[0].id;
    const txsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL ${timeSpan} DAY)`,
          eq(transactions.fromAddress, walletAddr)
        )
      );

    return {
      txCount: txsCount[0].count,
      message: `Found ${txsCount[0].count} transactions for chain ${supportedChain[0].name} in the last ${timeSpan} days.`
    };
  });
