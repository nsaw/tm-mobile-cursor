const { Pool } = require('pg');
require('dotenv').config();

// Use the same database configuration as the main app
const databaseConfig = {
  development: {
    url: 'postgresql://neondb_owner:npg_C4FEGOSh3iyW@ep-bold-star-a6c3eeph-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require',
    host: 'ep-bold-star-a6c3eeph-pooler.us-west-2.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_C4FEGOSh3iyW',
    ssl: true,
  }
};

const config = databaseConfig.development;

const pool = new Pool({
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  password: config.password,
  ssl: {
    rejectUnauthorized: false
  }
});

async function cleanupDemoContent() {
  const client = await pool.connect();
  
  try {
    // Find the demo user
    const demoUserResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@thoughtmarks.com']
    );
    
    if (demoUserResult.rows.length === 0) {
      console.log('Demo user not found');
      return;
    }
    
    const userId = demoUserResult.rows[0].id;
    console.log(`Found demo user with ID: ${userId}`);
    
    // Get all bins for the demo user
    const binsResult = await client.query(
      'SELECT id, name, created_at FROM bins WHERE user_id = $1 ORDER BY created_at',
      [userId]
    );
    
    console.log('Current bins:');
    binsResult.rows.forEach(bin => {
      console.log(`- ${bin.name} (ID: ${bin.id}, created: ${bin.created_at})`);
    });
    
    // Get all thoughtmarks for the demo user
    const thoughtmarksResult = await client.query(
      'SELECT id, title, bin_id, created_at FROM thoughtmarks WHERE user_id = $1 ORDER BY created_at',
      [userId]
    );
    
    console.log('\nCurrent thoughtmarks:');
    thoughtmarksResult.rows.forEach(thoughtmark => {
      console.log(`- ${thoughtmark.title} (ID: ${thoughtmark.id}, bin: ${thoughtmark.bin_id}, created: ${thoughtmark.created_at})`);
    });
    
    // Remove old thoughtmarks first (due to foreign key constraints)
    const templateTime = new Date('2025-06-23T23:00:00.000Z');
    const oldThoughtmarks = thoughtmarksResult.rows.filter(thoughtmark => new Date(thoughtmark.created_at) < templateTime);
    if (oldThoughtmarks.length > 0) {
      console.log('\nRemoving old demo thoughtmarks...');
      for (const thoughtmark of oldThoughtmarks) {
        await client.query(
          'DELETE FROM thoughtmarks WHERE id = $1',
          [thoughtmark.id]
        );
        console.log(`Removed thoughtmark: ${thoughtmark.title}`);
      }
    }
    // Remove old bins
    const oldBins = binsResult.rows.filter(bin => new Date(bin.created_at) < templateTime);
    if (oldBins.length > 0) {
      console.log('\nRemoving old demo bins...');
      for (const bin of oldBins) {
        await client.query(
          'DELETE FROM bins WHERE id = $1',
          [bin.id]
        );
        console.log(`Removed bin: ${bin.name}`);
      }
    }
    
    console.log('\nCleanup completed successfully!');
    
    // Show remaining content
    const remainingBinsResult = await client.query(
      'SELECT id, name FROM bins WHERE user_id = $1 ORDER BY sort_order',
      [userId]
    );
    
    const remainingThoughtmarksResult = await client.query(
      'SELECT id, title, bin_id FROM thoughtmarks WHERE user_id = $1 ORDER BY created_at',
      [userId]
    );
    
    console.log('\nRemaining template bins:');
    remainingBinsResult.rows.forEach(bin => {
      console.log(`- ${bin.name} (ID: ${bin.id})`);
    });
    
    console.log('\nRemaining template thoughtmarks:');
    remainingThoughtmarksResult.rows.forEach(thoughtmark => {
      console.log(`- ${thoughtmark.title} (ID: ${thoughtmark.id})`);
    });
    
  } catch (error) {
    console.error('Error cleaning up demo content:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupDemoContent(); 