import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '../shared/schema';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://rrfuganda_user:bKyRl7ZqAuJltStYsWEtLk7nOBT5sHQc@dpg-d1hbbcfgi27c73chd5s0-a.oregon-postgres.render.com/rrfuganda";

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create postgres client
const client = postgres(DATABASE_URL, {
  ssl: 'require',
  max: 1,
});

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Function to run migrations
export async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export default db;