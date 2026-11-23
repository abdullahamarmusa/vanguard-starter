import { defineConfig } from 'drizzle-kit';

const migrationDatabaseUrl = process.env.MIGRATION_DATABASE_URL;

if (!migrationDatabaseUrl) {
  throw new Error(
    'MIGRATION_DATABASE_URL must be set to generate or apply migrations.',
  );
}

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationDatabaseUrl,
  },
  strict: true,
  verbose: true,
});
