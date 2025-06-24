import { getDatabaseConfig } from './src/config/database';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: getDatabaseConfig().url,
  },
  verbose: true,
  strict: true,
}; 