/**
 * Database Migration Runner — Day 06
 *
 * Scans database/migrations/ for version-controlled SQL files,
 * tracks applied versions in `schema_migrations`, and applies pending
 * migrations inside atomic transactions.
 * Safe to execute repeatedly (idempotent).
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { pool, closePool } from './pool';

// Ensure backend/.env or root .env is loaded regardless of execution working directory
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

async function runMigrations(): Promise<void> {
  console.log('====================================================');
  console.log('  VisionRoot Database Migration Runner');
  console.log(`  Target Database: ${process.env.DB_NAME || 'visionroot_service_requests'}`);
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
  console.log('====================================================\n');

  const client = await pool.connect();

  try {
    // 1. Ensure the schema_migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Query already applied migrations
    const { rows: appliedRows } = await client.query<{ name: string }>(
      'SELECT name FROM schema_migrations ORDER BY id ASC;'
    );
    const appliedSet = new Set(appliedRows.map((r) => r.name));

    // 3. Locate migration directory
    const candidates = [
      path.resolve(process.cwd(), 'database/migrations'),
      path.resolve(process.cwd(), '../database/migrations'),
      path.resolve(__dirname, '../../../../database/migrations'),
    ];
    const migrationsDir = candidates.find((d) => fs.existsSync(d));

    if (!migrationsDir) {
      throw new Error(`Migrations directory not found in: ${candidates.join(', ')}`);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const pending = files.filter((f) => !appliedSet.has(f));

    if (pending.length === 0) {
      console.log('✅ Database schema is already up to date. No pending migrations.\n');
      console.log(`Applied migrations (${appliedSet.size}):`);
      appliedSet.forEach((m) => console.log(`  - [ALREADY APPLIED] ${m}`));
      return;
    }

    console.log(`Found ${pending.length} pending migration(s) to apply:\n`);

    for (const filename of pending) {
      const filePath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`Applying: ${filename}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1);',
          [filename]
        );
        await client.query('COMMIT');
        console.log(`✅ Successfully applied: ${filename}\n`);
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Migration failed on ${filename}:`, err.message);
        throw err;
      }
    }

    console.log('🎉 All migrations applied successfully.');
  } finally {
    client.release();
    await closePool();
  }
}

// Execute runner if invoked directly from CLI
if (require.main === module) {
  runMigrations().catch((err) => {
    console.error('Fatal migration error:', err.message);
    process.exit(1);
  });
}

export { runMigrations };
