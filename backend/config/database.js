const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test database connection with retry logic
const testConnection = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
      return true;
    } catch (err) {
      console.log(`⏳ Database connection attempt ${i + 1}/${retries} failed. Retrying in ${delay/1000}s...`);
      if (i === retries - 1) {
        console.error('❌ Failed to connect to database:', err.message);
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Initialize connection on module load
testConnection().catch(err => {
  console.error('Fatal: Could not establish database connection');
  process.exit(1);
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = { pool, testConnection };
