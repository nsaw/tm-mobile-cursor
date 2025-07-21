// Database configuration for Thoughtmarks Mobile App
export const databaseConfig = {
  // Production Database (default)
  production: {
    url: 'postgresql://neondb_owner:npg_C4FEGOSh3iyW@ep-sweet-sound-a62ozaho-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require',
    host: 'ep-sweet-sound-a62ozaho-pooler.us-west-2.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_C4FEGOSh3iyW',
    ssl: true,
  },
  
  // Development Database
  development: {
    url: 'postgresql://neondb_owner:npg_C4FEGOSh3iyW@ep-bold-star-a6c3eeph-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require',
    host: 'ep-bold-star-a6c3eeph-pooler.us-west-2.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_C4FEGOSh3iyW',
    ssl: true,
  },
};

// Get the appropriate database config based on environment
export const getDatabaseConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return databaseConfig[env as keyof typeof databaseConfig] || databaseConfig.development;
}; 