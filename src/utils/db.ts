import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  max: 10,
  idleTimeoutMillis: 30000,
});

export default pool;
