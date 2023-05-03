import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { config } from '../configs/server';

// Create the connection.
const connection = connect({
  host: config.host,
  username: config.username,
  password: config.password
});

export const db = drizzle(connection);
