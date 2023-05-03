import { type NextRequest, NextResponse } from 'next/server';
// import { Receiver } from '@upstash/qstash';
import { config as serverConfig } from '@/configs/server';
import { SignJWT, jwtVerify } from 'jose';

// interface UserJwtPayload {
//   jti: string
//   iat: number
// }
export class AuthError extends Error {}

const verifyAuth = async (key: string, req: NextRequest) => {
  const signature = req.headers.get('upstash-signature') as string | undefined;
  console.log({ signature });
  if (!signature) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      signature,
      new TextEncoder().encode(key)
    );
    console.log({ payload });
    return true;
  } catch {
    // throw new AuthError('Your token has expired.');
    return false;
  }
};

const rollingVerify = async (req: NextRequest) => {
  const currentSigningKey = serverConfig.qstash.currSigKey;
  if (!currentSigningKey) {
    console.log('ckey is missing');
    return NextResponse.json(null, {
      status: 500,
      statusText: 'ckey is missing'
    });
  }
  const nextSigningKey = serverConfig.qstash.nextSigKey;
  if (!nextSigningKey) {
    console.log('nkey is missing');
    return NextResponse.json(null, {
      status: 500,
      statusText: 'nkey is missing'
    });
  }

  const valid = await verifyAuth(serverConfig.qstash.currSigKey, req);
  if (valid) {
    return true;
  }
  return await verifyAuth(serverConfig.qstash.nextSigKey, req);
};

export default async function handler(req: NextRequest, res: NextResponse) {
  const valid = await rollingVerify(req);

  if (!valid) {
    return NextResponse.json(null, {
      status: 403,
      statusText: 'Forbidden'
    });
  }
  const data = await req.json();
  console.log({ data });

  return NextResponse.json(null, { status: 200, statusText: 'OK' });
}

export const config = {
  api: {
    bodyParser: false
  },
  runtime: 'edge'
};

// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIiLCJib2R5IjoiWDQ4RTlxT29rcXFydmR0czhuT0pSSk4zT1dEVW95V3hCZjdrYnU5REJQRT0iLCJleHAiOjE2ODMxMDA0NzEsImlhdCI6MTY4MzEwMDE3MSwiaXNzIjoiVXBzdGFzaCIsImp0aSI6Imp3dF82YnY3TTJ2TmRvajc0Q1R4UmdqaXAzMVpjbkgxIiwibmJmIjoxNjgzMTAwMTcxLCJzdWIiOiJodHRwczovLzU3ZDgtNDktMjI4LTE4Ni0xOTgubmdyb2stZnJlZS5hcHAvYXBpL3EtY2FsbGJhY2sifQ.ZD9w4xFSJqeFUSsRy9wrXiF8-Plqhs79Hyc2nYZsHq4'
