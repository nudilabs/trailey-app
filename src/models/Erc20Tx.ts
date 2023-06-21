import { eq, and, desc, sql, or } from 'drizzle-orm';
import { erc20Transactions } from '@/db/schema';
import { Erc20Tx } from '@/types/DB';
import { db } from '@/db/drizzle-db';

export const insertTxs = async (txs: Erc20Tx[]) => {
  await db
    .insert(erc20Transactions)
    .values(txs)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: sql`NOW()`
      }
    });
};
