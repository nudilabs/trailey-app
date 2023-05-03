export const config = {
  //db: 'drizzle'
  host: String(process.env.DB_HOST || 'localhost'),
  username: String(process.env.DB_USERNAME || 'root'),
  password: String(process.env.DB_PASSWORD || '12345'),
  //3rd party API
  covalentKey: String(process.env.COVALENT_KEY || '123')
};
