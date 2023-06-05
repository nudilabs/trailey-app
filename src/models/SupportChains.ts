import { eq } from 'drizzle-orm';
// import { Transaction } from '@/types/DB';
import { supportChains } from '@/db/schema';
import { db } from '@/db/drizzle-db';

export const getChain = async (chainName: string) => {
  const supportedChain = await db
    .select()
    .from(supportChains)
    .where(eq(supportChains.name, chainName));
  return supportedChain;
};
