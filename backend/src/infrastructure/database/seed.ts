/**
 * Database Seed Runner — Day 06
 *
 * Populates database with the 5 standard demo service requests
 * from database/seeds/. Safe to rerun repeatedly (idempotent).
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { pool, closePool } from './pool';

// Ensure backend/.env or root .env is loaded
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(__dirname, '../../../.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
}

async function runSeeds(): Promise<void> {
  console.log('====================================================');
  console.log('  VisionRoot Database Seed Runner');
  console.log(`  Target Database: ${process.env.DB_NAME || 'visionroot_service_requests'}`);
  console.log('====================================================\n');

  const client = await pool.connect();

  try {
    const candidates = [
      path.resolve(process.cwd(), 'database/seeds'),
      path.resolve(process.cwd(), '../database/seeds'),
      path.resolve(__dirname, '../../../../database/seeds'),
    ];
    const seedsDir = candidates.find((d) => fs.existsSync(d));

    if (!seedsDir) {
      throw new Error(`Seeds directory not found in: ${candidates.join(', ')}`);
    }

    const files = fs
      .readdirSync(seedsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      const filePath = path.join(seedsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`Executing seed script: ${filename}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`✅ Successfully seeded: ${filename}\n`);
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Seed failed on ${filename}:`, err.message);
        throw err;
      }
    }

    // Report seeded records count
    const { rows } = await client.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM service_requests;'
    );
    console.log(`🎉 Seeding complete. Total rows in service_requests: ${rows[0].count}`);
  } finally {
    client.release();
    await closePool();
  }
}

// Execute runner if invoked directly from CLI
if (require.main === module) {
  runSeeds().catch((err) => {
    console.error('Fatal seed error:', err.message);
    process.exit(1);
  });
}

export { runSeeds };
