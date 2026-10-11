'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const REQUIRED_ENV = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Errors on idle clients must be handled, otherwise they crash the process
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err);
});

module.exports = pool;