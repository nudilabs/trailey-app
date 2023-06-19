import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    //DB
    DB_HOST: z.string().default('localhost'),
    DB_USERNAME: z.string().default('root'),
    DB_PASSWORD: z.string().default('12345'),
    //3rd party API
    COVALENT_KEY: z.string(),
    COVALENT_URL: z.string().url().default('https://api.covalenthq.com/v1/'),
    QSTASH_CURRENT_SIGNING_KEY: z.string(),
    QSTASH_NEXT_SIGNING_KEY: z.string(),
    QSTASH_TOKEN: z.string(),
    //Server
    SERVER_HOST: z.string().url().default('http://localhost:3000/api/'),
    //Indexer.coerce
    INDEX_BATCH_SIZE: z.coerce.number().int().default(6),
    PAGE_PER_BATCH: z.coerce.number().int().default(50),
    TX_LIMIT: z.coerce.number().int().default(2000)
  },
  client: {
    //Next
    NEXT_PUBLIC_TX_LIMIT: z.coerce.number().int().default(2000),
    NEXT_PUBLIC_REVALIDATE_TIME: z.coerce.number().int().default(5000),
    NEXT_PUBLIC_DEFAULT_CHAIN: z.string().default('arbitrum-mainnet')
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    COVALENT_KEY: process.env.COVALENT_KEY,
    COVALENT_URL: process.env.COVALENT_URL,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    SERVER_HOST: process.env.SERVER_HOST,
    INDEX_BATCH_SIZE: process.env.INDEX_BATCH_SIZE,
    PAGE_PER_BATCH: process.env.PAGE_PER_BATCH,
    TX_LIMIT: process.env.TX_LIMIT,
    NEXT_PUBLIC_TX_LIMIT: process.env.NEXT_PUBLIC_TX_LIMIT,
    NEXT_PUBLIC_REVALIDATE_TIME: process.env.NEXT_PUBLIC_REVALIDATE_TIME,
    NEXT_PUBLIC_DEFAULT_CHAIN: process.env.NEXT_PUBLIC_DEFAULT_CHAIN
  }
});
