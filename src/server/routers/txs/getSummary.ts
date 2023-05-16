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
          value: 0,
          percentChange: 0
        },
        contractCount: {
          value: 0,
          percentChange: 0
        },
        valueQuoteSum: {
          value: 0,
          percentChange: 0
        },
        gasQuoteSum: {
          value: 0,
          percentChange: 0
        }
      };
    const chainId = supportedChain[0].id;

    interface QueryResult {
      txCount: number;
      contractCount: number;
      valueQuoteSum: number;
      gasQuoteSum: number;
    }
    const dataAllTime = (await db
      .select({
        txCount: sql`count(tx_hash)`,
        contractCount: sql`count(case when is_interact then 1 else null end)`,
        valueQuoteSum: sql`sum(value_quote)`,
        gasQuoteSum: sql`sum(gas_quote)` // CHECK THIS, does it include failed TXs?
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
        valueQuoteSum: sql`sum(value_quote)`,
        gasQuoteSum: sql`sum(gas_quote)` // CHECK THIS, does it include failed TXs?
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

    return {
      txCount: {
        value: dataAllTime[0].txCount,
        percentChange:
          (dataLastWeek[0].txCount /
            (dataAllTime[0].txCount - dataLastWeek[0].txCount)) *
          100
      },
      contractCount: {
        value: dataAllTime[0].contractCount,
        percentChange:
          (dataLastWeek[0].contractCount /
            (dataAllTime[0].contractCount - dataLastWeek[0].contractCount)) *
          100
      },
      valueQuoteSum: {
        value: dataAllTime[0].valueQuoteSum,
        percentChange:
          (dataLastWeek[0].valueQuoteSum /
            (dataAllTime[0].valueQuoteSum - dataLastWeek[0].valueQuoteSum)) *
          100
      },
      gasQuoteSum: {
        value: dataAllTime[0].gasQuoteSum,
        percentChange:
          (dataLastWeek[0].gasQuoteSum /
            (dataAllTime[0].gasQuoteSum - dataLastWeek[0].gasQuoteSum)) *
          100
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
        valueQuoteSum: sql`sum(value_quote)`,
        gasQuoteSum: sql`sum(gas_quote)` // CHECK THIS, does it include failed TXs?
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
        valueQuoteSum: sql`sum(value_quote)`,
        gasQuoteSum: sql`sum(gas_quote)` // CHECK THIS, does it include failed TXs?
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

    const txsByContractFormatted = txsByContractAllTime.map(tx => {
      const lastWeek = txsByContractLastWeek.find(
        txLastWeek => txLastWeek.address === tx.address
      );
      return {
        address: tx.address,
        txCount: {
          value: tx.txCount,
          percentChange: lastWeek
            ? (lastWeek.txCount / (tx.txCount - lastWeek.txCount)) * 100
            : 0
        },
        valueQuoteSum: {
          value: tx.valueQuoteSum,
          percentChange: lastWeek
            ? (lastWeek.valueQuoteSum /
                (tx.valueQuoteSum - lastWeek.valueQuoteSum)) *
              100
            : 0
        },
        gasQuoteSum: {
          value: tx.gasQuoteSum,
          percentChange: lastWeek
            ? (lastWeek.gasQuoteSum / (tx.gasQuoteSum - lastWeek.gasQuoteSum)) *
              100
            : 0
        }
      };
    });
    return { contracts: txsByContractFormatted };
  });
