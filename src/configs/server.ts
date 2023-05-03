export const config = {
  //db: 'drizzle'
  host: String(process.env.DB_HOST || 'localhost'),
  username: String(process.env.DB_USERNAME || 'root'),
  password: String(process.env.DB_PASSWORD || '12345'),
  //3rd party API
  covalentKey: String(process.env.COVALENT_KEY || '123'),
  qstash: {
    currSigKey: String(process.env.QSTASH_CURRENT_SIGNING_KEY || '123'),
    nextSigKey: String(process.env.QSTASH_NEXT_SIGNING_KEY || '123')
  }
};
