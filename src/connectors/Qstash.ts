import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { Client } from '@upstash/qstash';
import { config as serverConfig } from '@/configs/server';

export class SignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SignatureError';
  }
}

export class QStash {
  private readonly apiToken?: string;
  private readonly currentSigningKey: string;
  private readonly nextSigningKey: string;
  constructor(
    currentSigningKey: string,
    nextSigningKey: string,
    apiToken?: string
  ) {
    this.currentSigningKey = currentSigningKey;
    this.nextSigningKey = nextSigningKey;
    this.apiToken = apiToken;
  }

  private async authWithKey(key: string, req: NextRequest): Promise<boolean> {
    const signature = req.headers.get('upstash-signature') as
      | string
      | undefined;
    if (!signature) {
      throw new SignatureError('signature is missing');
    }
    const parts = signature.split('.');

    if (parts.length !== 3) {
      throw new SignatureError(
        '`Upstash-Signature` header is not a valid signature'
      );
    }

    //cast playload type

    try {
      const { payload } = await jwtVerify(
        signature,
        new TextEncoder().encode(key)
      );

      if (payload.iss !== 'Upstash') {
        throw new SignatureError(`invalid issuer: ${payload.iss}`);
      }

      if (typeof req.url === undefined && payload.sub !== req.url) {
        throw new SignatureError(
          `invalid subject: ${payload.sub}, want: ${req.url}`
        );
      }
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.nbf) {
        if (now > payload.exp) {
          throw new SignatureError('token has expired');
        }
        if (now < payload.nbf) {
          throw new SignatureError('token is not yet valid');
        }
      }

      return true;
    } catch (e) {
      // throw new SignatureError('signature does not match');
      return false;
    }
  }

  public async auth(req: NextRequest): Promise<boolean> {
    const valid = await this.authWithKey(this.currentSigningKey, req);
    if (valid) {
      return true;
    }
    return await this.authWithKey(this.nextSigningKey, req);
  }

  public async publishMsg(path: string, body: any): Promise<any> {
    const client = new Client({ token: String(this.apiToken) });
    const response = await client.publishJSON({
      url: serverConfig.serverUrl + path,
      body
    });
    return response;
  }
}
