import { eq, and, desc, sql, or } from 'drizzle-orm';
import { walletsInfo, transactions } from '@/db/schema';
import { db } from '@/db/drizzle-db';

export const getInfo = async (chainId: number, address: string) => {
  const walletInfo = await db
    .select()
    .from(walletsInfo)
    .where(
      and(eq(walletsInfo.address, address), eq(walletsInfo.chainId, chainId))
    );
  return walletInfo;
};

//get recent page from db  by join transactions table
export const getRecentTx = async (chainId: number, address: string) => {
  const recentPage = await db
    .select()
    .from(walletsInfo)
    .leftJoin(
      transactions,
      and(
        or(
          eq(walletsInfo.address, transactions.fromAddress),
          eq(walletsInfo.address, transactions.toAddress)
        ),
        eq(walletsInfo.chainId, transactions.chainId)
      )
    )
    .where(
      and(eq(walletsInfo.address, address), eq(walletsInfo.chainId, chainId))
    )
    .orderBy(desc(transactions.blockHeight))
    .limit(1);
  return recentPage;
};

export const upsertRecentPage = async (
  chainId: number,
  address: string,
  recentPage: number
) => {
  await db
    .insert(walletsInfo)
    .values({
      chainId,
      address,
      recentPage
    })
    .onDuplicateKeyUpdate({
      set: {
        recentPage,
        updatedAt: sql`NOW()`
      }
    });
};
