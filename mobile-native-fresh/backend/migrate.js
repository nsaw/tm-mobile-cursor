const fs = require('fs');
const path = require('path');

// Read the SQL migration file
const sqlFile = fs.readFileSync(path.join(__dirname, 'migration-export-complete.sql'), 'utf8');

// Import the database connection using dynamic import for ES modules
async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    // Import the database connection
    const { db } = await import('./src/db/index.js');
    
    // Split the SQL file into individual statements
    const statements = sqlFile
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 100)}...`);
        await db.execute(statement);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration(); 