export const config = {
  host: String(process.env.DB_HOST || 'localhost'),
  username: String(process.env.DB_USERNAME || 'root'),
  password: String(process.env.DB_PASSWORD || '12345')
};
