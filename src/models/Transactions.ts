import { and, eq, sql } from 'drizzle-orm';
import { Transaction } from '@/types/DB';
import { transactions, erc20Transactions } from '@/db/schema';
import { db } from '@/db/drizzle-db';

export const insertTxs = async (txs: Transaction[]) => {
  await db
    .insert(transactions)
    .values(txs)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: sql`NOW()`
      }
    });
};

export const getWalletTxStats = async (chainId: number, walletAddr: string) => {
  const walletTxStats = await db
    .select({
      txCount: sql<number>`count(DISTINCT transactions.tx_hash)`,
      contractCount: sql<number>`count(DISTINCT case when is_interact then transactions.tx_hash else null end)`,
      valueSum: sql<number>`coalesce(sum(DISTINCT transactions.value), 0)`,
      valueQuoteSum: sql<number>`coalesce(sum(DISTINCT transactions.value_quote), 0)`,
      erc20ValueQuoteSum: sql<number>`coalesce(sum(DISTINCT erc20_transactions.value_quote), 0)`,
      gasSum: sql<number>`coalesce(sum(DISTINCT transactions.gas_quote), 0)`,
      gasQuoteSum: sql<number>`coalesce(sum(DISTINCT transactions.gas_quote), 0)`
    })
    .from(transactions)
    .leftJoin(
      erc20Transactions,
      eq(transactions.txHash, erc20Transactions.txHash)
    )
    .where(
      and(
        eq(transactions.chainId, 6),
        eq(
          transactions.fromAddress,
          '0xfbFA1dC9e4a3972421aBCA95c85891dF83ACAb54'
        ),
        eq(transactions.success, true)
      )
    );

  return walletTxStats[0];
};

export const getWalletTxStatsbyWeek = async (
  chainId: number,
  walletAddr: string,
  week: number
) => {
  const walletTxStats = await db
    .select({
      txCount: sql<number>`count(DISTINCT transactions.tx_hash)`,
      contractCount: sql<number>`count(DISTINCT case when is_interact then transactions.tx_hash else null end)`,
      valueSum: sql<number>`coalesce(sum(DISTINCT transactions.value), 0)`,
      valueQuoteSum: sql<number>`coalesce(sum(DISTINCT transactions.value_quote), 0)`,
      erc20ValueQuoteSum: sql<number>`coalesce(sum(DISTINCT erc20_transactions.value_quote), 0)`,
      gasSum: sql<number>`coalesce(sum(DISTINCT transactions.gas_quote), 0)`,
      gasQuoteSum: sql<number>`coalesce(sum(DISTINCT transactions.gas_quote), 0)`
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
        sql`transactions.block_signed_at >= DATE_SUB(NOW(), INTERVAL ${
          week * 7
        } DAY)`,
        eq(transactions.success, true)
      )
    );

  return walletTxStats[0];
};

export const getWalletStatsByContract = async (
  chainId: number,
  walletAddr: string
) => {
  const walletStatsByContract = await db
    .select({
      address: transactions.toAddress,
      txCount: sql<number>`count(DISTINCT transactions.tx_hash)`,
      valueQuoteSum: sql<number>`coalesce(sum(DISTINCT transactions.value_quote), 0)`,
      erc20ValueQuoteSum: sql<number>`coalesce(sum(DISTINCT erc20_transactions.value_quote), 0)`,
      gasQuoteSum: sql<number>`coalesce(sum(DISTINCT transactions.gas_quote), 0)`,
      lastTx: sql<string>`max(transactions.block_signed_at)`
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
    .groupBy(transactions.toAddress);

  return walletStatsByContract;
};

// const txsByContractAllTime = (await db
//   .select({
//     address: sql`to_address`,
//     txCount: sql`count(tx_hash)`,
//     valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
//     gasQuoteSum: sql`coalesce(sum(gas_quote), 0)`, // CHECK THIS, does it include failed TXs?
//     signedAt: sql`max(block_signed_at)`
//   })
//   .from(transactions)
//   .where(
//     and(
//       eq(transactions.chainId, chainId),
//       eq(transactions.fromAddress, walletAddr)
//     )
//   )
//   .groupBy(sql`to_address`)
//   .orderBy(sql`count(tx_hash) DESC`)) as unknown as QueryResult[];

// const lastActiveDates = (await db
//   .select({
//     address: sql`to_address`,
//     lastActive: sql`MAX(block_signed_at)`
//   })
//   .from(transactions)
//   .where(
//     and(
//       eq(transactions.chainId, chainId),
//       eq(transactions.fromAddress, walletAddr)
//     )
//   )
//   .groupBy(sql`to_address`)) as unknown as QueryResult[];

// const txsByContractLastWeek = (await db
//   .select({
//     address: sql`to_address`,
//     txCount: sql`count(tx_hash)`,
//     valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
//     gasQuoteSum: sql`coalesce(sum(gas_quote), 0)`, // CHECK THIS, does it include failed TXs?
//     signedAt: sql`max(block_signed_at)`
//   })
//   .from(transactions)
//   .where(
//     and(
//       eq(transactions.chainId, chainId),
//       eq(transactions.fromAddress, walletAddr),
//       sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
//     )
//   )
//   .groupBy(sql`to_address`)
//   .orderBy(sql`count(tx_hash) DESC`)) as unknown as QueryResult[];

// const txsByContractLastTwoWeeks = (await db
//   .select({
//     address: sql`to_address`,
//     txCount: sql`count(tx_hash)`,
//     valueQuoteSum: sql`coalesce(sum(value_quote), 0)`,
//     gasQuoteSum: sql`coalesce(sum(gas_quote), 0)`, // CHECK THIS, does it include failed TXs?
//     signedAt: sql`max(block_signed_at)`
//   })
//   .from(transactions)
//   .where(
//     and(
//       eq(transactions.chainId, chainId),
//       eq(transactions.fromAddress, walletAddr),
//       sql`block_signed_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)`
//     )
//   )
//   .groupBy(sql`to_address`)
//   .orderBy(sql`count(tx_hash) DESC`)) as unknown as QueryResult[];
