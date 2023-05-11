import { and, eq, sql } from 'drizzle-orm';
import { Transaction } from '@/types/DB';
import { transactions } from '@/db/schema';
import { db } from '@/db/drizzle-db';

export const getLatest = async (chainId: number, walletAddr: string) => {
  const tx = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.chainId, chainId),
        eq(transactions.fromAddress, walletAddr)
      )
    )
    .orderBy(sql`block_height DESC`)
    .limit(1);
  return tx[0];
};

export const insertTxs = async (txs: Transaction[]) => {
  await db.insert(transactions).values(txs);
};
