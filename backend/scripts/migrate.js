const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const MIGRATIONS_DIR = path.join(__dirname, '../src/db/migrations');

async function runMigrations() {
  try {
    await client.connect();
    console.log('Connected to database');

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files`);

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      let sql = fs.readFileSync(filePath, 'utf8');

      // Add IF NOT EXISTS to various CREATE statements for idempotency
      sql = sql.replace(/CREATE INDEX (\w+)/g, 'CREATE INDEX IF NOT EXISTS $1');
      sql = sql.replace(/CREATE UNIQUE INDEX (\w+)/g, 'CREATE UNIQUE INDEX IF NOT EXISTS $1');
      sql = sql.replace(/CREATE FUNCTION/g, 'CREATE OR REPLACE FUNCTION');
      sql = sql.replace(/CREATE TRIGGER (\w+)/g, 'CREATE OR REPLACE TRIGGER $1');

      console.log(`Running migration: ${file}`);
      await client.query(sql);
      console.log(`✓ ${file} completed`);
    }

    console.log('\n✓ All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
