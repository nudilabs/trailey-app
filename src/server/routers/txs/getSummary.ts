import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { publicProcedure } from '@/server/trpc';
import { db } from '@/db/drizzle-db';
import { erc20Transactions, supportChains, transactions } from '@/db/schema';
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
      erc20ValueQuoteSum: calculateChange(
        dataAllTime.erc20ValueQuoteSum,
        dataLastWeek.erc20ValueQuoteSum,
        dataLastTwoWeeks.erc20ValueQuoteSum
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
      erc20ValueQuoteSum: number;
    }

    const chainId = supportedChain[0].id;
    const txsByMonth = (await db
      .select({
        year: sql<string>`YEAR(transactions.block_signed_at)`,
        month: sql<string>`MONTH(transactions.block_signed_at)`,
        txCount: sql<number>`COUNT(transactions.tx_hash)`,
        contractCount: sql<number>`COUNT(CASE WHEN transactions.is_interact THEN 1 ELSE NULL END)`,
        valueQuoteSum: sql<number>`SUM(transactions.value_quote)`,
        gasQuoteSum: sql<number>`SUM(transactions.gas_quote)`,
        erc20ValueQuoteSum: sql<number>`coalesce(sum(DISTINCT erc20_transactions.value_quote), 0)`
      })
      .from(transactions)
      .leftJoin(
        erc20Transactions,
        eq(transactions.txHash, erc20Transactions.txHash)
      )
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          eq(transactions.success, true)
        )
      )
      .groupBy(
        sql`YEAR(transactions.block_signed_at)`,
        sql`MONTH(transactions.block_signed_at)`
      )
      .orderBy(
        sql`YEAR(transactions.block_signed_at) ASC`,
        sql`MONTH(transactions.block_signed_at) ASC`
      )) as unknown as QueryResult[];

    const txsByMonthFormatted = txsByMonth.map(tx => {
      return {
        // combine month and year as date
        date: tx.month + '/' + tx.year,
        txCount: tx.txCount,
        contractCount: tx.contractCount,
        valueQuoteSum: tx.valueQuoteSum,
        gasQuoteSum: tx.gasQuoteSum,
        erc20ValueQuoteSum: tx.erc20ValueQuoteSum
      };
    });
    return {
      txsByMonth: txsByMonthFormatted
    };
  });
