import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connection Configuration: Prioritize DATABASE_URL (for Neon/Render cloud deployments)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false }
    }
  : {
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      port: Number(process.env.PGPORT || process.env.DB_PORT) || 5432,
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.PGDATABASE || process.env.DB_NAME || 'sengaanthal_db',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

// Adapt query method for compatibility with parameterized queries and array destructuring
const originalQuery = pool.query.bind(pool);

pool.query = async function (text, params) {
  let queryText = text;

  // Convert MySQL-style '?' placeholders to PostgreSQL '$1, $2, ...' if present
  if (typeof queryText === 'string' && queryText.includes('?') && (!params || !queryText.includes('$1'))) {
    let index = 1;
    queryText = queryText.replace(/\?/g, () => `$${index++}`);
  }

  // Ensure INSERT statements return id if not already returning columns
  const isInsert = typeof queryText === 'string' && /^\s*INSERT\s+INTO\s+/i.test(queryText);
  if (isInsert && !/\bRETURNING\b/i.test(queryText)) {
    queryText += ' RETURNING id';
  }

  const result = await originalQuery(queryText, params);

  // Set convenience aliases matching MySQL result conventions
  if (result.rows && result.rows.length > 0 && result.rows[0]?.id !== undefined) {
    result.insertId = result.rows[0].id;
  }
  result.affectedRows = result.rowCount;

  // Enable iterable destructuring:
  // For SELECT: first yielded item is result.rows (the array of rows)
  // For INSERT/UPDATE/DELETE: first yielded item is result (carrying insertId/affectedRows)
  const isSelect = typeof queryText === 'string' && /^\s*SELECT\b/i.test(queryText);

  result[Symbol.iterator] = function* () {
    if (isSelect) {
      yield result.rows;
      yield result;
    } else {
      yield result;
      yield result.rows;
    }
  };

  return result;
};

export async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT current_database() as db_name, version()');
    console.log(`[Database] Connected to PostgreSQL database "${res.rows[0].db_name}" successfully.`);
    client.release();
    return true;
  } catch (error) {
    console.error('\n======================================================');
    console.error('[Database Error] Failed to connect to PostgreSQL database!');
    console.error(`Details: ${error.message}`);
    console.error('Please verify PostgreSQL is running or DATABASE_URL in server/.env is correct.');
    console.error('======================================================\n');
    return false;
  }
}

export default pool;
