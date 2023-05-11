export const config = {
  //db: 'drizzle'
  host: String(process.env.DB_HOST || 'localhost'),
  username: String(process.env.DB_USERNAME || 'root'),
  password: String(process.env.DB_PASSWORD || '12345'),
  //3rd party API
  covalent: {
    key: String(process.env.COVALENT_KEY || '123'),
    url: String(process.env.COVALENT_URL || 'https://api.covalenthq.com/v1/')
  },
  qstash: {
    currSigKey: String(process.env.QSTASH_CURRENT_SIGNING_KEY || '123'),
    nextSigKey: String(process.env.QSTASH_NEXT_SIGNING_KEY || '123'),
    token: String(process.env.QSTASH_TOKEN || '123')
  },
  //server
  serverUrl: String(process.env.SERVER_HOST || 'http://localhost:3000/api/'),

  //indexer
  batchSize: Number(process.env.INDEX_BATCH_SIZE || 7)
};
