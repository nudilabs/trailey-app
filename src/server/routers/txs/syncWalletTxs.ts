import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { publicProcedure } from '@/server/trpc';
import { db } from '@/db/drizzle-db';
import { supportChains, transactions } from '@/db/schema';
import { config as serverConfig } from '@/configs/server';
import { Covalent } from '@/connectors/Covalent';

export const syncWalletTxs = publicProcedure
  .input(
    z.object({
      chainName: z.string(),
      walletAddr: z.string()
    })
  )
  .mutation(async opts => {
    const { chainName, walletAddr } = opts.input;
    const supportedChain = await db
      .select()
      .from(supportChains)
      .where(eq(supportChains.name, chainName));
    if (supportedChain.length === 0)
      return {
        message: `Chain ${chainName} is not supported`
      };

    const chainId = supportedChain[0].id;

    // select latest block height from wallet from transactions table
    const latestTx = await db
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

    // const latestBlockHeight = latestTx.length ? latestTx[0].blockHeight : 0;
    const covalent = new Covalent(serverConfig.covalent.key);
    const recentCovTxPage = await covalent.getWalletRecentTxs(
      chainName,
      walletAddr
    );

    let startPage = 0;
    // "links": {
    //     "prev"
    //     :
    //     null,
    //     "next"
    // }

    if (latestTx.length === 0) {
      if (recentCovTxPage.items.length === 0) {
        return {
          message: `No transactions found for wallet ${walletAddr} on chain ${chainName}`
        };
      }
    }

    //get covalent recent txs
    const txs = await covalent.getWalletRecentTxs(chainName, walletAddr);
  });
