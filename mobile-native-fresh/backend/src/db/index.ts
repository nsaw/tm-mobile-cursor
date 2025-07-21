import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getDatabaseConfig } from '../config/database';

import * as schema from './schema';

// Get database configuration
const dbConfig = getDatabaseConfig();

// Create postgres client with Neon configuration
const client = postgres(dbConfig.url, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: dbConfig.ssl,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

export default db; 