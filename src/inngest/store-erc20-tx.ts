import { inngest } from './client';
import { Covalent } from '@/connectors/Covalent';
import { env } from '@/env.mjs';
import { start } from 'repl';

const getErc20Trasnfers = async (
  chainName: string,
  walletAddr: string,
  tokenAddr: string
) => {
  const allProducts = [];
  // let cursor: any = null;
  let startBlock = 1;
  let hasMore = true;

  const covalent = new Covalent(env.COVALENT_KEY);
  while (hasMore) {
    // step.run will be retried automatically if the request fails
    const res = await covalent.getErc20Trasnfers(
      chainName,
      walletAddr,
      tokenAddr,
      startBlock
    );
    // Combine all of the data into a single list
    if (!res.data) return;

    const { itmes, pagination } = res.data;
    for (let tx of itmes) {
      // console.log(tx);
    }

    // allProducts.push(...page.products);
    if (pagination.has_more) {
      startBlock = pagination.itmes[0].block_height + 1;
    } else {
      hasMore = false;
    }
    // if (page.products.length === 50) {
    //   cursor = page.products[49].id;
    // } else {
    //   hasMore = false;
    // }
  }
  // const res = await covalent.getErc20Trasnfers(
  //   chainName,
  //   walletAddr,
  //   tokenAddr
  // );
  // return res;
};

export default inngest.createFunction(
  {
    name: 'Store ERC20 txs'
  },
  { event: 'store/erc20-tx' },
  async ({ event, step }) => {
    console.log(event.data);
    const covalent = new Covalent(env.COVALENT_KEY);

    const balances = await step.run('get token balances', async () => {
      const res = await covalent.getERC20Balances(
        event.data.chainName,
        event.data.walletAddr
      );
      return res;
    });

    if (balances.data) {
      for (let token of balances.data.items) {
        if (token.native_token) continue;

        await step.run('get token transfers', async () => {});
      }
    } else {
      console.log('no tokens');
      return;
    }
  }
); // <-- this is the name of the function
