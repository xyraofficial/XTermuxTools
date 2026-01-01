import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL_EXTERNAL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
});

export const db = drizzle(pool);