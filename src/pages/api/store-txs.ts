import { type NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle-db';
import { Transaction } from '@/types/DB';
// import { InferModel } from 'drizzle-orm';
import { supportChains, transactions } from '@/db/schema';
import { config as serverConfig } from '@/configs/server';
import { QStash } from '@/connectors/Qstash';
import sha256 from 'crypto-js/sha256';
import { Covalent } from '@/connectors/Covalent';
// import { Receiver } from '@upstash/qstash';
import moment from 'moment';
import * as z from 'zod';

export const config = {
  runtime: 'edge'
};

// type Transaction = InferModel<typeof transactions, 'insert'>;

const schema = z.object({
  chainName: z.string(),
  walletAddr: z.string(),
  startPage: z.number().int(),
  endPage: z.number().int(),
  totalPage: z.number().int().positive()
});

const getTxs = async (
  chainName: string,
  walletAddr: string,
  startPage: number,
  endPage: number,
  chainId: number
  // totalPage: number
) => {
  const txs = [];
  const totalGetPage = endPage - startPage;

  const batch = serverConfig.batchSize;
  const batchCount = Math.ceil(totalGetPage / batch);
  console.log('totalPage', totalGetPage);
  console.log('batchCount', batchCount);

  const covalent = new Covalent(serverConfig.covalent.key);

  for (let i = 0; i < batchCount; i++) {
    const promises = [];

    for (let j = 0; j < batch; j++) {
      const page = startPage + i * batch + j;
      if (page > endPage) break;
      promises.push(covalent.getWalletTxsByPage(chainName, walletAddr, page));
    }

    const res = await Promise.all(promises);
    for (let j = 0; j < res.length; j++) {
      let tmpData = [];
      for (const item of res[j]?.data?.items) {
        if (item.from_address !== walletAddr.toLowerCase()) continue;

        const signDate = moment.utc(item.block_signed_at).toDate();

        let tmp: Transaction = {
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
          page: res[j]?.page,
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

  const qstash = new QStash(
    serverConfig.qstash.currSigKey,
    serverConfig.qstash.nextSigKey,
    serverConfig.qstash.token
  );

  const valid = await qstash.auth(req);

  if (!valid)
    return NextResponse.json(null, {
      status: 401,
      statusText: 'Unauthorized'
    });

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
      return NextResponse.json(null, {
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
      // totalPage
    );

    console.log('txs', txs.length);

    if (txs.length > 0) {
      await db.insert(transactions).values(txs);
    }

    const nextStartPage = endPage + 1;
    const nextEndPage =
      nextStartPage + 50 > totalPage ? totalPage - 1 : nextStartPage + 50;

    if (nextStartPage < totalPage) {
      const nextStore = {
        chainName,
        walletAddr,
        startPage: nextStartPage,
        endPage: nextEndPage,
        totalPage
      };
      //create hash for deduplication id from nextStore
      const deduplicationId = sha256(JSON.stringify(nextStore)).toString();
      await qstash.publishMsg('store-txs', nextStore, deduplicationId);
      console.log('deduplicationId: ', deduplicationId);

      return NextResponse.json(
        {
          status: 'continue store',
          nextStore
        },
        {
          status: 200
        }
      );
    } else {
      return NextResponse.json(null, { status: 200 });
    }
  } catch (e) {
    console.log('error from api');
    console.log(e);
    return NextResponse.json(null, { status: 400, statusText: 'Bad Request' });
  }
}
