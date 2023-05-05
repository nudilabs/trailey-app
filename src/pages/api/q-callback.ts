import { type NextRequest, NextResponse } from 'next/server';
import { QStash } from '@/utils/qstash';
import { config as serverConfig } from '@/configs/server';

export default async function handler(req: NextRequest, res: NextResponse) {
  const qstash = new QStash(
    serverConfig.qstash.token,
    serverConfig.qstash.currSigKey,
    serverConfig.qstash.nextSigKey
  );

  const valid = await qstash.auth(req);

  if (!valid) {
    return NextResponse.json(null, {
      status: 403,
      statusText: 'Forbidden'
    });
  }
  const data = await req.json();
  console.log({ data });

  const { chainName, walletAddr, totalPage, startPage, endPage } = data;

  return NextResponse.json(null, { status: 200, statusText: 'OK' });
}

export const config = {
  api: {
    bodyParser: false
  },
  runtime: 'edge'
};

// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIiLCJib2R5IjoiWDQ4RTlxT29rcXFydmR0czhuT0pSSk4zT1dEVW95V3hCZjdrYnU5REJQRT0iLCJleHAiOjE2ODMxMDA0NzEsImlhdCI6MTY4MzEwMDE3MSwiaXNzIjoiVXBzdGFzaCIsImp0aSI6Imp3dF82YnY3TTJ2TmRvajc0Q1R4UmdqaXAzMVpjbkgxIiwibmJmIjoxNjgzMTAwMTcxLCJzdWIiOiJodHRwczovLzU3ZDgtNDktMjI4LTE4Ni0xOTgubmdyb2stZnJlZS5hcHAvYXBpL3EtY2FsbGJhY2sifQ.ZD9w4xFSJqeFUSsRy9wrXiF8-Plqhs79Hyc2nYZsHq4'
