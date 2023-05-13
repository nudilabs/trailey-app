import { z } from 'zod';
import moment from 'moment';
import _ from 'lodash';
import { publicProcedure } from '@/server/trpc';
import { Transaction } from '@/types/DB';
import { config as serverConfig } from '@/configs/server';
import { Covalent } from '@/connectors/Covalent';
import { QStash } from '@/connectors/Qstash';
import * as TxModel from '@/models/Transactions';
import * as SupportChainsModel from '@/models/SupportChains';

const preData = async (
  txs: any,
  chainId: number,
  walletAddr: string,
  latestTx: any
) => {
  //get dbrecent page txs from covalent

  const txsToInsert = txs.filter((tx: any) => {
    if (
      tx.block_height >= Number(latestTx.blockHeight) &&
      tx.tx_hash !== latestTx.txHash &&
      tx.from_address === walletAddr
    ) {
      const signDate = moment.utc(tx.block_signed_at).toDate();
      let tmp: Transaction = {
        signedAt: signDate,
        blockHeight: tx.block_height,
        txHash: tx.tx_hash,
        txOffset: tx.tx_offset,
        success: tx.successful,
        fromAddress: tx.from_address,
        fromAddressLabel: tx.from_address_label,
        toAddress: tx.to_address,
        toAddressLabel: tx.to_address_label,
        value: tx.value,
        valueQuote: tx.value_quote,
        feesPaid: tx.fees_paid,
        gasQuote: tx.gas_quote,
        page: latestTx.page,
        chainId
      };
      return tmp;
    } else {
      return false;
    }
  });

  return txsToInsert;
};

export const syncWalletTxs = publicProcedure
  .input(
    z.object({
      chainName: z.string(),
      walletAddr: z.string()
    })
  )
  .mutation(async opts => {
    const { chainName, walletAddr } = opts.input;

    console.log('chainName', chainName);
    console.log('walletAddr', walletAddr);
    const supportChain = await SupportChainsModel.getChain(chainName);

    if (supportChain.length === 0)
      return {
        message: `Chain ${chainName} is not supported`
      };

    const chainId = supportChain[0].id;

    // select latest block height from wallet from transactions table
    const latestTx = await TxModel.getLatest(chainId, walletAddr);

    const covalent = new Covalent(serverConfig.covalent.key);
    const recentCovTxPage = await covalent.getWalletRecentTxs(
      chainName,
      walletAddr
    );
    const links = recentCovTxPage.data.links;

    const pubStoreMsg = {
      chainName,
      walletAddr,
      startPage: 0,
      // endPage: 0,
      totalPage: 0
    };

    //get recent page from covalent
    let covRecentPage: number;
    if (links.prev) {
      const regex = /\/page\/(\d+)\//;
      const match = links.prev.match(regex);
      const prevCovRecentPage = match && match[1];
      covRecentPage = prevCovRecentPage ? Number(prevCovRecentPage) + 1 : 0;
    } else {
      covRecentPage = 0;
    }
    pubStoreMsg.totalPage = covRecentPage + 1;

    //case 1: no txs in db
    if (!latestTx) {
      //case 1.1: no txs in covalent
      if (recentCovTxPage.data.items.length === 0) {
        return {
          message: `No transactions found for wallet ${walletAddr} on chain ${chainName}`
        };
      }
      //case 1.2: txs in covalent
      pubStoreMsg.startPage = 0;

      // if (Number(covRecentPage) < serverConfig.pagePerBatch) {
      //   pubStoreMsg.endPage = covRecentPage;
      // } else {
      //   pubStoreMsg.endPage = serverConfig.pagePerBatch;
      // }

      const qstash = new QStash(
        serverConfig.qstash.currSigKey,
        serverConfig.qstash.nextSigKey,
        serverConfig.qstash.token
      );
      // const deduplicationId = sha256(JSON.stringify(pubStoreMsg)).toString();
      await qstash.publishMsg('store-txs', pubStoreMsg);
      console.log('case no txs in db');
    } //case 2: txs in db
    else {
      //case 2.1: recent tx page  in db is less than from covalent
      const dbRecentPage = latestTx.page;
      console.log('dbRecentPage :', dbRecentPage);
      console.log('covRecentPage :', covRecentPage);
      if (dbRecentPage != null && latestTx) {
        if (dbRecentPage < covRecentPage) {
          const res = await covalent.getWalletTxsByPage(
            chainName,
            walletAddr,
            dbRecentPage
          );
          const txs = res?.data.data.items;
          const txsToInsert = await preData(txs, chainId, walletAddr, latestTx);

          if (txsToInsert.length > 0) {
            console.log('txsToInsert', txsToInsert.length);
            await TxModel.insertTxs(txsToInsert);
          }

          const caseStartPage = dbRecentPage + 1;

          pubStoreMsg.startPage = caseStartPage;

          const qstash = new QStash(
            serverConfig.qstash.currSigKey,
            serverConfig.qstash.nextSigKey,
            serverConfig.qstash.token
          );

          await qstash.publishMsg('store-txs', pubStoreMsg);
          console.log('case dbRecentPage < covRecentPage');
          console.log('case have tx in db');
        } //case 2.2: recent tx page  in db is equa from covalent
        else if (dbRecentPage === covRecentPage) {
          const txs = recentCovTxPage.data.items;
          const txsToInsert = await preData(txs, chainId, walletAddr, latestTx);
          if (txsToInsert.length > 0) {
            console.log('txsToInsert', txsToInsert.length);
            await TxModel.insertTxs(txsToInsert);
          }
          console.log('case dbRecentPage == covRecentPage ');
        }
      } else {
        console.log('case dbRecentPage === undefined ');
      }
    }
  });
