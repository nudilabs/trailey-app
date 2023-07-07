import { inngest } from './client';
import { Covalent } from '@/connectors/Covalent';
import * as Erc20TxModel from '@/models/Erc20Tx';
import * as WalletsInfoModel from '@/models/WalletsInfo';
import * as SupportedChainsModel from '@/models/SupportChains';
import { Erc20Tx } from '@/types/DB';
import moment from 'moment';
import { env } from '@/env.mjs';

const getErc20Trasnfers = async (
  chainName: string,
  chainId: number,
  walletAddr: string,
  walletRecentBlock: number,
  tokenAddr: string
) => {
  const allTxs: Erc20Tx[] = [];
  let startBlock = walletRecentBlock;
  let lastBlock = walletRecentBlock;
  let hasMore = true;

  const covalent = new Covalent(env.COVALENT_KEY);
  while (hasMore) {
    const res = await covalent.getErc20Trasnfers(
      chainName,
      walletAddr,
      tokenAddr,
      startBlock
    );
    const { items, pagination } = res.data;

    if (items.length === 0) {
      hasMore = false;
      break;
    }

    lastBlock = items[0].block_height + 1;

    for (let tx of items) {
      const signAt = moment.utc(tx.block_signed_at).toDate();
      // console.log('tx', tx.block_height);
      let txData: Erc20Tx = {
        txHash: tx.tx_hash,
        signedAt: signAt,
        blockHeight: tx.block_height,
        chainId: chainId
      };
      for (let transfer of tx.transfers) {
        txData.contractAddress = transfer.contract_address;
        txData.contractDecimals = transfer.contract_decimals;
        txData.contractSymbol = transfer.contract_ticker_symbol;
        txData.fromAddress = transfer.from_address;
        txData.contractName = transfer.contract_name;
        txData.toAddress = transfer.to_address;
        txData.amount = transfer.delta;
        txData.amountQuote = transfer.delta_quote;
        txData.transferType = transfer.transfer_type;
        txData.quoteRate = transfer.quote_rate;
        //push data
        allTxs.push(txData);
      }
    }

    if (pagination.has_more) {
      startBlock = pagination.items[0].block_height + 1;
    } else {
      hasMore = false;
    }
  }

  if (allTxs.length > 0) {
    await Erc20TxModel.insertTxs(allTxs);
  }
  return {
    lastBlock
  };
};

export default inngest.createFunction(
  {
    name: 'Store ERC20 txs'
  },
  { event: 'store/erc20-tx' },
  async ({ event, step }) => {
    const chain = await step.run('get chain', async () => {
      return await SupportedChainsModel.getChain(event.data.chainName);
    });
    if (chain.length === 0) return;

    const chainId = chain[0].id;
    const covalent = new Covalent(env.COVALENT_KEY);

    const balances = await step.run('get token balances', async () => {
      return await covalent.getERC20Balances(
        event.data.chainName,
        event.data.walletAddr
      );
    });

    if (balances.data) {
      let walletInfo = await step.run('get wallet info', async () => {
        return await WalletsInfoModel.getInfo(chainId, event.data.walletAddr);
      });

      let walletRecentBlock =
        walletInfo.length > 0 ? walletInfo[0].recentBlock || 1 : 1;

      let lastStoreBlock = walletRecentBlock;

      let hasNewTxs = false;

      for (let token of balances.data.items) {
        if (token.native_token) continue;
        const storeData = await step.run('get token transfers', async () => {
          return await getErc20Trasnfers(
            event.data.chainName,
            chainId,
            event.data.walletAddr,
            walletRecentBlock,
            token.contract_address
          );
        });

        if (storeData) {
          hasNewTxs = true;
          if (lastStoreBlock < storeData.lastBlock) {
            lastStoreBlock = storeData.lastBlock;
          }
        }
      }

      if (hasNewTxs) {
        console.log('update recent block');

        await step.run('update recent block', async () => {
          await WalletsInfoModel.upsertRecentBlock(
            chainId,
            event.data.walletAddr,
            lastStoreBlock
          );
        });
      }
      return;
    } else {
      console.log('no tokens');
      return;
    }
  }
); // <-- this is the name of the function
