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

const demoBins = [
  {
    name: 'Work & Projects',
    description: 'Professional tasks and project-related items',
    color: '#3B82F6',
    icon: '💼',
    sortOrder: 1
  },
  {
    name: 'Personal',
    description: 'Personal tasks and reminders',
    color: '#10B981',
    icon: '👤',
    sortOrder: 2
  },
  {
    name: 'Ideas & Notes',
    description: 'Random ideas and quick notes',
    color: '#F59E0B',
    icon: '💡',
    sortOrder: 3
  },
  {
    name: 'Shopping',
    description: 'Shopping lists and errands',
    color: '#EF4444',
    icon: '🛒',
    sortOrder: 4
  },
  {
    name: 'Health & Fitness',
    description: 'Workout plans and health goals',
    color: '#8B5CF6',
    icon: '💪',
    sortOrder: 5
  },
  {
    name: 'Travel',
    description: 'Travel plans and itineraries',
    color: '#06B6D4',
    icon: '✈️',
    sortOrder: 6
  }
];

const demoThoughtmarks = [
  {
    title: 'React Native Best Practices',
    content: 'Always use StyleSheet.create for better performance. Avoid inline styles and use proper component composition. Remember to handle loading states and error boundaries. Use React.memo for expensive components and implement proper navigation patterns.',
    tags: ['react-native', 'performance', 'best-practices', 'mobile'],
    binId: 1,
    isTask: false,
    isPinned: true
  },
  {
    title: 'Grocery Shopping List',
    content: 'Milk, bread, eggs, cheese, tomatoes, onions, garlic, olive oil, pasta, chicken breast, spinach, bananas, apples, yogurt, granola, coffee beans, honey, peanut butter',
    tags: ['shopping', 'food', 'groceries', 'list'],
    binId: 4,
    isTask: true,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed Q1 goals and objectives. Key focus areas: user acquisition, feature development, and team expansion. Budget approved for new hires. Need to prioritize mobile app development and improve user onboarding flow.',
    tags: ['meeting', 'planning', 'business', 'q1'],
    binId: 1,
    isTask: false
  },
  {
    title: 'Call Mom',
    content: 'Remember to call mom this weekend to check in and see how she\'s doing. Ask about her garden and the new recipe she wanted to try.',
    tags: ['personal', 'family', 'reminder'],
    binId: 2,
    isTask: true,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
  },
  {
    title: 'Book Flight to Conference',
    content: 'Need to book flight for React Native conference in San Francisco. Check dates and book early for better prices. Also need to book hotel near the conference center.',
    tags: ['travel', 'work', 'conference', 'booking'],
    binId: 6,
    isTask: true,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
  },
  {
    title: 'Workout Plan - Week 1',
    content: 'Monday: Cardio (30 min), Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio (45 min), Saturday: Full body, Sunday: Rest. Focus on form and progressive overload.',
    tags: ['fitness', 'workout', 'planning', 'health'],
    binId: 5,
    isTask: false
  },
  {
    title: 'App Feature Ideas',
    content: 'Dark mode toggle, voice note transcription, offline sync, collaborative bins, AI-powered tagging, export to PDF, calendar integration, reminder notifications, search filters, bulk operations',
    tags: ['ideas', 'features', 'app', 'development'],
    binId: 3,
    isTask: false
  },
  {
    title: 'Dinner Recipe - Pasta Carbonara',
    content: 'Ingredients: spaghetti, eggs, pancetta, parmesan, black pepper, salt. Cook pasta, crisp pancetta, mix eggs with cheese, combine while hot, season with pepper. Serve immediately.',
    tags: ['recipe', 'cooking', 'pasta', 'dinner'],
    binId: 2,
    isTask: false
  },
  {
    title: 'Project Timeline - Mobile App',
    content: 'Week 1-2: Design and planning, Week 3-4: Core features, Week 5-6: Testing and refinement, Week 7: Launch preparation, Week 8: Soft launch and feedback collection',
    tags: ['project', 'timeline', 'mobile', 'planning'],
    binId: 1,
    isTask: false,
    isPinned: true
  },
  {
    title: 'Read Books This Month',
    content: '1. Atomic Habits by James Clear, 2. Deep Work by Cal Newport, 3. The Pragmatic Programmer, 4. React Native in Action. Set aside 30 minutes daily for reading.',
    tags: ['reading', 'books', 'learning', 'personal'],
    binId: 2,
    isTask: true,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
];

async function seedDemoData() {
  const client = await pool.connect();
  
  try {
    console.log('Starting demo data seeding...');
    
    // Get the demo user ID
    const userResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@thoughtmarks.com']
    );
    
    if (userResult.rows.length === 0) {
      console.log('Demo user not found. Please run demo login first to create the user.');
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log(`Found demo user with ID: ${userId}`);
    
    // Insert bins
    console.log('Inserting demo bins...');
    const binIds = [];
    for (const bin of demoBins) {
      const result = await client.query(
        `INSERT INTO bins (name, description, color, icon, user_id, sort_order, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id`,
        [bin.name, bin.description, bin.color, bin.icon, userId, bin.sortOrder]
      );
      binIds.push(result.rows[0].id);
      console.log(`Created bin: ${bin.name} (ID: ${result.rows[0].id})`);
    }
    
    // Insert thoughtmarks
    console.log('Inserting demo thoughtmarks...');
    for (const thoughtmark of demoThoughtmarks) {
      const binId = binIds[thoughtmark.binId - 1]; // Convert 1-based index to actual bin ID
      const result = await client.query(
        `INSERT INTO thoughtmarks (
          title, content, tags, bin_id, user_id, is_task, is_completed, is_pinned, is_deleted,
          due_date, sort_order, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING id`,
        [
          thoughtmark.title,
          thoughtmark.content,
          thoughtmark.tags,
          binId,
          userId,
          thoughtmark.isTask,
          false, // is_completed
          thoughtmark.isPinned || false,
          false, // is_deleted
          thoughtmark.dueDate || null,
          0, // sort_order
        ]
      );
      console.log(`Created thoughtmark: ${thoughtmark.title} (ID: ${result.rows[0].id})`);
    }
    
    console.log('Demo data seeding completed successfully!');
    console.log(`Created ${demoBins.length} bins and ${demoThoughtmarks.length} thoughtmarks`);
    
  } catch (error) {
    console.error('Error seeding demo data:', error);
  } finally {
    client.release();
  }
}

// Run the seeding
seedDemoData()
  .then(() => {
    console.log('Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  }); 