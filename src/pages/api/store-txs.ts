import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge'
};

type reqBody = {
  chainName: string;
  walletAddr: string;
  totalPage: number;
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    // return new Response(null, { status: 404, statusText: 'Not Found' });
    return NextResponse.json(null, { status: 404, statusText: 'Not Found' });

  try {
    const json = await req.json();
    console.log({ json });

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 400, statusText: 'Bad Request' });
  }
}
