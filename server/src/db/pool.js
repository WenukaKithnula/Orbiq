import pg from 'pg';

// One shared connection pool for the whole app. Every query goes through
// this rather than opening a fresh connection each time.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
