import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { publicProcedure } from '@/server/trpc';
import { db } from '@/db/drizzle-db';
import { supportChains, transactions } from '@/db/schema';

export const getSummary = publicProcedure
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
        txCount: {
          allTime: 0,
          lastWeek: 0,
          percentChange: 0
        },
        contractCount: {
          allTime: 0,
          lastWeek: 0,
          percentChange: 0
        },
        valueSum: {
          allTime: 0,
          lastWeek: 0,
          percentChange: 0
        },
        valueQuoteSum: {
          allTime: 0,
          lastWeek: 0,
          percentChange: 0
        },
        gasSum: {
          allTime: 0,
          lastWeek: 0,
          percentChange: 0
        },
        gasQuoteSum: {
          allTime: 0,
          lastWeek: 0,
          percentChange: 0
        }
      };
    const chainId = supportedChain[0].id;

    interface QueryResult {
      txCount: number;
      contractCount: number;
      valueSum: number;
      valueQuoteSum: number;
      gasSum: number;
      gasQuoteSum: number;
    }
    const dataAllTime = (await db
      .select({
        txCount: sql`count(tx_hash)`,
        contractCount: sql`count(case when is_interact then 1 else null end)`,
        valueSum: sql`coalesce(sum(value), 0)`,
        valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
        gasSum: sql`coalesce(sum(gas_quote), 0)`,
        gasQuoteSum: sql`coalesce(sum(gas_quote), 0)` // CHECK THIS, does it include failed TXs?
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr)
        )
      )
      .orderBy(sql`DATE(block_signed_at) DESC`)) as unknown as QueryResult[];
    const dataLastWeek = (await db
      .select({
        txCount: sql`count(tx_hash)`,
        contractCount: sql`count(case when is_interact then 1 else null end)`,
        valueSum: sql`coalesce(sum(value), 0)`,
        valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
        gasSum: sql`coalesce(sum(gas_quote), 0)`,
        gasQuoteSum: sql`coalesce(sum(gas_quote), 0)` // CHECK THIS, does it include failed TXs?
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        )
      )
      .orderBy(sql`DATE(block_signed_at) DESC`)) as unknown as QueryResult[];

    const dataLastTwoWeeks = (await db
      .select({
        txCount: sql`count(tx_hash)`,
        contractCount: sql`count(case when is_interact then 1 else null end)`,
        valueSum: sql`coalesce(sum(value), 0)`,
        valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
        gasSum: sql`coalesce(sum(gas_quote), 0)`,
        gasQuoteSum: sql`coalesce(sum(gas_quote), 0)`
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)`
        )
      )
      .orderBy(sql`DATE(block_signed_at) DESC`)) as unknown as QueryResult[];

    // Difference in change from 2 weeks ago to last week

    const txCountPercentChange =
      ((dataLastWeek[0].txCount - dataLastTwoWeeks[0].txCount) /
        dataLastTwoWeeks[0].txCount) *
      100;

    const contractCountPercentChange =
      ((dataLastWeek[0].contractCount - dataLastTwoWeeks[0].contractCount) /
        dataLastTwoWeeks[0].contractCount) *
      100;

    const valueSumPercentChange =
      ((dataLastWeek[0].valueSum - dataLastTwoWeeks[0].valueSum) /
        dataLastTwoWeeks[0].valueSum) *
      100;

    const valueQuoteSumPercentChange =
      ((dataLastWeek[0].valueQuoteSum - dataLastTwoWeeks[0].valueQuoteSum) /
        dataLastTwoWeeks[0].valueQuoteSum) *
      100;

    const gasSumPercentChange =
      ((dataLastWeek[0].gasSum - dataLastTwoWeeks[0].gasSum) /
        dataLastTwoWeeks[0].gasSum) *
      100;

    const gasQuoteSumPercentChange =
      ((dataLastWeek[0].gasQuoteSum - dataLastTwoWeeks[0].gasQuoteSum) /
        dataLastTwoWeeks[0].gasQuoteSum) *
      100;
    return {
      txCount: {
        allTime: dataAllTime[0].txCount,
        lastWeek: dataLastWeek[0].txCount,
        percentChange: txCountPercentChange
      },
      contractCount: {
        allTime: dataAllTime[0].contractCount,
        lastWeek: dataLastWeek[0].contractCount,
        percentChange: contractCountPercentChange
      },
      valueSum: {
        allTime: dataAllTime[0].valueSum,
        lastWeek: dataLastWeek[0].valueSum,
        percentChange: valueSumPercentChange
      },
      valueQuoteSum: {
        allTime: dataAllTime[0].valueQuoteSum,
        lastWeek: dataLastWeek[0].valueQuoteSum,
        percentChange: valueQuoteSumPercentChange
      },
      gasSum: {
        allTime: dataAllTime[0].gasSum,
        lastWeek: dataLastWeek[0].gasSum,
        percentChange: gasSumPercentChange
      },
      gasQuoteSum: {
        allTime: dataAllTime[0].gasQuoteSum,
        lastWeek: dataLastWeek[0].gasQuoteSum,
        percentChange: gasQuoteSumPercentChange
      }
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
    const supportedChain = await db
      .select()
      .from(supportChains)
      .where(eq(supportChains.name, chainName));
    if (supportedChain.length === 0) return { contracts: [] };
    interface QueryResult {
      address: string;
      txCount: number;
      valueQuoteSum: number;
      gasQuoteSum: number;
    }
    const chainId = supportedChain[0].id;
    const txsByContractAllTime = (await db
      .select({
        address: sql`to_address`,
        txCount: sql`count(tx_hash)`,
        valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
        gasQuoteSum: sql`coalesce(sum(gas_quote), 0)` // CHECK THIS, does it include failed TXs?
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          eq(transactions.isInteract, true)
        )
      )
      .groupBy(sql`to_address`)
      .orderBy(sql`count(tx_hash) DESC`)) as unknown as QueryResult[];

    const txsByContractLastWeek = (await db
      .select({
        address: sql`to_address`,
        txCount: sql`count(tx_hash)`,
        valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
        gasQuoteSum: sql`coalesce(sum(gas_quote), 0)` // CHECK THIS, does it include failed TXs?
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
          eq(transactions.isInteract, true)
        )
      )
      .groupBy(sql`to_address`)
      .orderBy(sql`count(tx_hash) DESC`)) as unknown as QueryResult[];

    const txsByContractLastTwoWeeks = (await db
      .select({
        address: sql`to_address`,
        txCount: sql`count(tx_hash)`,
        valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
        gasQuoteSum: sql`coalesce(sum(gas_quote), 0)` // CHECK THIS, does it include failed TXs?
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.chainId, chainId),
          eq(transactions.fromAddress, walletAddr),
          sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)`,
          eq(transactions.isInteract, true)
        )
      )
      .groupBy(sql`to_address`)
      .orderBy(sql`count(tx_hash) DESC`)) as unknown as QueryResult[];

    const txsByContractFormatted = txsByContractAllTime.map(tx => {
      const lastWeek = txsByContractLastWeek.find(
        txLastWeek => txLastWeek.address === tx.address
      );
      const lastTwoWeeks = txsByContractLastTwoWeeks.find(
        txLastTwoWeeks => txLastTwoWeeks.address === tx.address
      );

      // Difference in change from 2 weeks ago to last week

      const txCountPercentChange =
        lastWeek && lastTwoWeeks
          ? ((lastWeek.txCount - lastTwoWeeks.txCount) / lastTwoWeeks.txCount) *
            100
          : 0;

      const valueQuoteSumPercentChange =
        lastWeek && lastTwoWeeks
          ? ((lastWeek.valueQuoteSum - lastTwoWeeks.valueQuoteSum) /
              lastTwoWeeks.valueQuoteSum) *
            100
          : 0;

      const gasQuoteSumPercentChange =
        lastWeek && lastTwoWeeks
          ? ((lastWeek.gasQuoteSum - lastTwoWeeks.gasQuoteSum) /
              lastTwoWeeks.gasQuoteSum) *
            100
          : 0;

      return {
        address: tx.address,
        txCount: {
          allTime: tx.txCount,
          lastWeek: lastWeek ? lastWeek.txCount : 0,
          percentChange: txCountPercentChange
        },
        valueQuoteSum: {
          allTime: tx.valueQuoteSum,
          lastWeek: lastWeek ? lastWeek.valueQuoteSum : 0,
          percentChange: valueQuoteSumPercentChange
        },
        gasQuoteSum: {
          allTime: tx.gasQuoteSum,
          lastWeek: lastWeek ? lastWeek.gasQuoteSum : 0,
          percentChange: gasQuoteSumPercentChange
        }
      };
    });
    return { contracts: txsByContractFormatted };
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
