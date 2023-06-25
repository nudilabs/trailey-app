import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { publicProcedure } from '@/server/trpc';
import { db } from '@/db/drizzle-db';
import { supportChains, transactions } from '@/db/schema';
import { getDefaultSummary, calculateChange } from '../../utils/fmt';
import * as TrasactionsModel from '@/models/Transactions';
import * as SupportChainsModel from '@/models/SupportChains';

export const getSummary = publicProcedure
  .input(
    z.object({
      chainName: z.string(),
      walletAddr: z.string()
    })
  )
  .query(async opts => {
    const { chainName, walletAddr } = opts.input;
    const supportedChain = await SupportChainsModel.getChain(chainName);
    if (supportedChain.length === 0) return getDefaultSummary();
    const chainId = supportedChain[0].id;

    const dataAllTime = await TrasactionsModel.getWalletTxStats(
      chainId,
      walletAddr
    );
    const dataLastWeek = await TrasactionsModel.getWalletTxStatsbyWeek(
      chainId,
      walletAddr,
      1
    );
    const dataLastTwoWeeks = await TrasactionsModel.getWalletTxStatsbyWeek(
      chainId,
      walletAddr,
      2
    );
    return {
      txCount: calculateChange(
        dataAllTime.txCount,
        dataLastWeek.txCount,
        dataLastTwoWeeks.txCount
      ),
      contractCount: calculateChange(
        dataAllTime.contractCount,
        dataLastWeek.contractCount,
        dataLastTwoWeeks.contractCount
      ),
      valueSum: calculateChange(
        dataAllTime.valueSum,
        dataLastWeek.valueSum,
        dataLastTwoWeeks.valueSum
      ),
      valueQuoteSum: calculateChange(
        dataAllTime.valueQuoteSum,
        dataLastWeek.valueQuoteSum,
        dataLastTwoWeeks.valueQuoteSum
      ),
      gasSum: calculateChange(
        dataAllTime.gasSum,
        dataLastWeek.gasSum,
        dataLastTwoWeeks.gasSum
      ),
      gasQuoteSum: calculateChange(
        dataAllTime.gasQuoteSum,
        dataLastWeek.gasQuoteSum,
        dataLastTwoWeeks.gasQuoteSum
      )
    };
  });

export const getSummaryByContract = publicProcedure
  .input(
    z.object({
      chainName: z.string(),
      walletAddr: z.string()
    })
  )
  .query(async opts => {
    const { chainName, walletAddr } = opts.input;
    const supportedChain = await SupportChainsModel.getChain(chainName);
    if (supportedChain.length === 0) return { contracts: [] };

    const chainId = supportedChain[0].id;
    const walletStatsByContract =
      await TrasactionsModel.getWalletStatsByContract(chainId, walletAddr);

    return { contracts: walletStatsByContract };
  });

export const getSummaryByMonth = publicProcedure
  .input(
    z.object({
      chainName: z.string(),
      walletAddr: z.string()
    })
  )
  .query(async opts => {
    const { chainName, walletAddr } = opts.input;
    const supportedChain = await db
      .select()
      .from(supportChains)
      .where(eq(supportChains.name, chainName));
    if (supportedChain.length === 0)
      return {
        txsByMonth: []
      };

    interface QueryResult {
      year: number;
      month: number;
      txCount: number;
      contractCount: number;
      valueQuoteSum: number;
      gasQuoteSum: number;
    }

    const chainId = supportedChain[0].id;
    const txsByMonth = (await db
      .select({
        year: sql`YEAR(block_signed_at)`,
        month: sql`MONTH(block_signed_at)`,
        txCount: sql`COUNT(tx_hash)`,
        contractCount: sql`COUNT(CASE WHEN is_interact THEN 1 ELSE NULL END)`,
        valueQuoteSum: sql`SUM(value_quote)`,
        gasQuoteSum: sql`SUM(gas_quote)`
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          eq(transactions.success, true)
        )
      )
      .groupBy(sql`YEAR(block_signed_at)`, sql`MONTH(block_signed_at)`)
      .orderBy(
        sql`YEAR(block_signed_at) ASC`,
        sql`MONTH(block_signed_at) ASC`
      )) as unknown as QueryResult[];

    const txsByMonthFormatted = txsByMonth.map(tx => {
      return {
        // combine month and year as date
        date: tx.month + '/' + tx.year,
        txCount: tx.txCount,
        contractCount: tx.contractCount,
        valueQuoteSum: tx.valueQuoteSum,
        gasQuoteSum: tx.gasQuoteSum
      };
    });
    return {
      txsByMonth: txsByMonthFormatted
    };
  });
