import { type NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle-db';
import { InferModel } from 'drizzle-orm';
import { supportChains, transactions } from '@/db/schema';
import { config as serverConfig } from '@/configs/server';
import { Receiver } from '@upstash/qstash';
import moment from 'moment';
import * as z from 'zod';

export const config = {
  runtime: 'edge'
};

type Transaction = InferModel<typeof transactions, 'insert'>;

const schema = z.object({
  chainName: z.string(),
  walletAddr: z.string(),
  startPage: z.number().int(),
  endPage: z.number().int(),
  totalPage: z.number().int().positive()
});

const getTxsByPage = async (
  chainName: string,
  walletAddr: string,
  page: number
) => {
  const url = `https://api.covalenthq.com/v1/${chainName}/address/${walletAddr}/transactions_v3/page/${page}/`;
  let headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(serverConfig.covalentKey));
  const res = await fetch(url, { method: 'GET', headers });
  console.log(res.status);
  try {
    const data = await res.json();
    return data;
  } catch (e) {
    // console.log(await res.json());
    // const resD = await res.json();

    console.log('error from covalent');
    console.log(e);
  }
};

const getTxs = async (
  chainName: string,
  walletAddr: string,
  startPage: number,
  endPage: number,
  chainId: number
) => {
  const txs = [];
  const totalPage = endPage - startPage;

  const batch = 7;
  const batchCount = Math.ceil(totalPage / batch);

  for (let i = 0; i < batchCount; i++) {
    const promises = [];

    for (let j = 0; j < batch; j++) {
      const page = startPage + i * batch + j;
      if (page >= totalPage) break;
      promises.push(getTxsByPage(chainName, walletAddr, page));
    }

    const data = await Promise.all(promises);
    for (let j = 0; j < data.length; j++) {
      let tmpData = [];
      for (const item of data[j].data.items) {
        // const isTxExist = await db
        //   .select()
        //   .from(transactions)
        //   .where(eq(transactions.txHash, item.tx_hash));

        // if (isTxExist.length > 0) continue;
        const signDate = moment.utc(item.block_signed_at).toDate();

        let tmp: Transaction = {
          signedAt: signDate,
          blockHeight: item.block_height,
          txHash: item.tx_hash,
          txOffset: item.tx_offset,
          success: item.success,
          fromAddress: item.from_address,
          fromAddressLabel: item.from_address_label,
          toAddress: item.to_address,
          toAddressLabel: item.to_address_label,
          value: item.value,
          valueQuote: item.value_quote,
          feesPaid: item.fees_paid,
          chainId
        };

        if (item.log_events) {
          if (item.log_events.length > 0) {
            delete item.log_events;
            tmpData.push({
              ...tmp,
              isInteract: true
            });
          }
        } else {
          delete item.log_events;
          tmpData.push({ ...tmp, isInteract: false, chainId });
        }
      }

      txs.push(...tmpData);
    }
  }

  return txs;
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return NextResponse.json(null, { status: 404, statusText: 'Not Found' });

  // const signature = req.headers.get['upstash-signature'] as string | undefined;
  // console.log({ signature });
  // if (!signature) {
  //   res.status(200).send('This request is not coming from qstash');
  //   return res.end();
  // }

  try {
    const json = await req.json();
    const { chainName, walletAddr, totalPage, startPage, endPage } =
      schema.parse(json);

    const supportedChain = await db
      .select()
      .from(supportChains)
      .where(eq(supportChains.name, chainName));
    console.log(supportedChain);

    if (supportedChain.length === 0)
      return new Response(null, {
        status: 400,
        statusText: 'unsupported chain'
      });

    const chainId = supportedChain[0].id;

    // console.log({ chainName, walletAddr, totalPage });
    const txs: Transaction[] = await getTxs(
      chainName,
      walletAddr,
      startPage,
      endPage,
      chainId
    );

    // console.log(txs);
    console.log('txs', txs.length);

    if (txs.length > 0) {
      await db.insert(transactions).values(txs);
    }

    if (endPage < totalPage) {
      const resBody = {
        chainName,
        walletAddr,
        startPage: endPage,
        endPage: endPage + 50,
        totalPage
      };
      return NextResponse.json(resBody, {
        status: 200
      });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (e) {
    console.log('error from api');
    console.log(e);
    return NextResponse.json(null, { status: 400, statusText: 'Bad Request' });
  }
}
