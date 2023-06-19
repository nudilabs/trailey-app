import { and, eq, sql } from 'drizzle-orm';
import { Transaction } from '@/types/DB';
import { transactions } from '@/db/schema';
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
