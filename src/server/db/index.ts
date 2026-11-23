import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema';

const globalForDatabase = globalThis as typeof globalThis & {
  vanguardSql?: Sql;
};

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL must be set before using PostgreSQL.');
  }

  globalForDatabase.vanguardSql ??= postgres(connectionString, {
    max: 10,
    connect_timeout: 10,
    idle_timeout: 20,
  });

  return drizzle(globalForDatabase.vanguardSql, { schema });
}
