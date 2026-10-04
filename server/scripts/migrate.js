import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('[Migration] Starting schema execution against Neon PostgreSQL...');
  try {
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    console.log(`[Migration] Read schema from ${schemaPath}`);
    console.log('[Migration] Executing SQL against Neon database...');

    // Execute the complete schema
    await pool.query(sqlContent);
    console.log('[Migration] SQL schema executed successfully.\n');

    // 1. Verify Tables
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'poems', 'bookmarks')
      ORDER BY table_name;
    `);
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log('[Verification] Tables present in database:', tables);

    // 2. Verify Foreign Keys
    const fkRes = await pool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';
    `);
    console.log('\n[Verification] Foreign Keys:');
    fkRes.rows.forEach(fk => {
      console.log(`  - ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name} (ON DELETE ${fk.delete_rule})`);
    });

    // 3. Verify Unique Constraints
    const uniqueRes = await pool.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
        string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'UNIQUE'
        AND tc.table_schema = 'public'
      GROUP BY tc.table_name, tc.constraint_name;
    `);
    console.log('\n[Verification] Unique Constraints:');
    uniqueRes.rows.forEach(u => {
      console.log(`  - ${u.table_name}: ${u.constraint_name} (${u.columns})`);
    });

    // 4. Verify Column Types
    const colsRes = await pool.query(`
      SELECT table_name, column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN ('users', 'poems', 'bookmarks')
      ORDER BY table_name, ordinal_position;
    `);
    console.log('\n[Verification] Columns:');
    colsRes.rows.forEach(c => {
      console.log(`  - ${c.table_name}.${c.column_name}: ${c.data_type} (Default: ${c.column_default || 'none'}, Nullable: ${c.is_nullable})`);
    });

    if (pool.end) await pool.end();
    console.log('\n[Migration Completed Successfully]');
    process.exit(0);
  } catch (error) {
    console.error('\n[Migration Error]:', error.message);
    if (pool.end) await pool.end();
    process.exit(1);
  }
}

runMigration();
