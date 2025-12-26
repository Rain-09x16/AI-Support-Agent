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

const SEEDS_DIR = path.join(__dirname, '../src/db/seeds');

async function runSeeds() {
  try {
    await client.connect();
    console.log('Connected to database');

    const files = fs
      .readdirSync(SEEDS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} seed files`);

    for (const file of files) {
      const filePath = path.join(SEEDS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running seed: ${file}`);
      await client.query(sql);
      console.log(`✓ ${file} completed`);
    }

    console.log('\n✓ All seeds completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeeds();
