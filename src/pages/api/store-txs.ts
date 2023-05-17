import { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle-db';
import { Transaction } from '@/types/DB';
import { supportChains, transactions } from '@/db/schema';
import { config as serverConfig } from '@/configs/server';
import { QStash } from '@/connectors/Qstash';
// import { Covalent } from '@/connectors/Covalent';
import moment from 'moment';
import * as z from 'zod';
import axios from 'axios';

// export const config = {
//   runtime: 'edge'
// };

const schema = z.object({
  chainName: z.string(),
  walletAddr: z.string(),
  startPage: z.number().int(),
  // endPage: z.number().int(),
  totalPage: z.number().int().positive()
});

const getTxs = async (
  chainName: string,
  walletAddr: string,
  startPage: number,
  // endPage: number,
  chainId: number,
  totalPage: number
) => {
  const batch = serverConfig.batchSize;

  let totalGetPage;
  if (startPage + serverConfig.pagePerBatch > totalPage) {
    totalGetPage = totalPage - startPage;
  } else {
    totalGetPage = serverConfig.pagePerBatch;
  }
  const batchCount = Math.ceil(totalGetPage / batch);

  console.log('totalPage', totalGetPage);
  console.log('batchCount', batchCount);

  const fetchTxs = async (
    page: number
  ): Promise<{ items: any; page: number }> => {
    //   const url = `${serverConfig.covalent.url}${chainName}/address/${walletAddr}/transactions_v3/page/${page}/`;
    return new Promise((resolve, reject) => {
      const url = `${serverConfig.covalent.url}${chainName}/address/${walletAddr}/transactions_v3/page/${page}/`;
      axios
        .get(url, {
          headers: { Authorization: 'Basic ' + btoa(serverConfig.covalent.key) }
        })
        .then(res => {
          resolve({ items: res.data.data.items, page });
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const txs = [];
  for (let i = 0; i < batchCount; i++) {
    const promises = [];

    for (let j = 0; j < batch; j++) {
      const page = startPage + i * batch + j;
      if (!(page < totalPage) || i * batch + j >= totalGetPage) break;
      // console.log('round', i * batch + j);
      // const url = `${serverConfig.covalent.url}${chainName}/address/${walletAddr}/transactions_v3/page/${page}/`;
      promises.push(fetchTxs(page));
    }

    // const res = await axios.all(promises);
    const res = await Promise.all(promises);
    // const data = res.map((r): any => r.data.data.items);
    // const data = res.map((r): any => r.items);

    // console.log('resolve data', res.length);
    txs.push(...res);
  }
  const result = [];

  for (let tx of txs) {
    const { items, page } = tx;
    // console.log('items', items);
    for (let item of items) {
      if (item.from_address.toLowerCase() !== walletAddr.toLowerCase()) {
        continue;
      } else {
        const signDate = moment.utc(item.block_signed_at).toDate();
        let tmpTx: Transaction = {
          signedAt: signDate,
          blockHeight: item.block_height,
          txHash: item.tx_hash,
          txOffset: item.tx_offset,
          success: item.successful,
          fromAddress: item.from_address,
          fromAddressLabel: item.from_address_label,
          toAddress: item.to_address,
          toAddressLabel: item.to_address_label,
          value: item.value,
          valueQuote: item.value_quote,
          feesPaid: item.fees_paid,
          gasQuote: item.gas_quote,
          page,
          isInteract:
            item.log_events && item.log_events.length > 0 ? true : false,
          chainId
        };
        result.push(tmpTx);
      }
    }
  }

  // console.log('txs len', result.length);
  // console.log('txs[0]', result[0]);
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('store-txs trigger');
  if (req.method !== 'POST')
    // return NextResponse.json(null, { status: 404, statusText: 'Not Found' });
    return res.status(404).json({ status: 404, statusText: 'Not Found' });

  const qstash = new QStash(
    serverConfig.qstash.currSigKey,
    serverConfig.qstash.nextSigKey,
    serverConfig.qstash.token
  );

  const valid = await qstash.auth(req);
  if (!valid)
    return res.status(401).json({ status: 401, statusText: 'Auth Err' });

  try {
    const json = req.body;
    const { chainName, walletAddr, totalPage, startPage } = schema.parse(json);

    const supportedChain = await db
      .select()
      .from(supportChains)
      .where(eq(supportChains.name, chainName));

    if (supportedChain.length === 0)
      return res.status(404).json({ status: 404, statusText: 'Not Found' });

    const chainId = supportedChain[0].id;

    const txs = await getTxs(
      chainName,
      walletAddr,
      startPage,
      chainId,
      totalPage
    );

    if (txs.length > 0) {
      await db.insert(transactions).values(txs);
    }

    const nextStartPage =
      startPage + serverConfig.pagePerBatch > totalPage
        ? totalPage
        : startPage + serverConfig.pagePerBatch;
    // const nextEndPage =
    //   nextStartPage + 50 > totalPage ? totalPage - 1 : nextStartPage + 50;
    console.log('nextStartPage', nextStartPage);
    console.log('totalPage', totalPage);

    if (nextStartPage < totalPage) {
      const nextStore = {
        chainName,
        walletAddr,
        startPage: nextStartPage,
        // endPage: nextEndPage,
        totalPage
      };
      //create hash for deduplication id from nextStore
      await qstash.publishMsg('store-txs', nextStore);

      return res.status(200).json(nextStore);
    } else {
      return res.status(200).json({ status: 200, statusText: 'OK' });
    }
  } catch (e) {
    console.log('error from api');
    console.log(e);
    return res.status(500).json({ status: 500, statusText: 'Internal Error' });
  }
}
