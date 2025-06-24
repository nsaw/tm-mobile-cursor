import { db } from './src/db';
import { bins, thoughtmarks, users } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function addTemplateContent() {
  try {
    console.log('Starting template content creation...');

    // Find the demo user
    let demoUser = await db.select().from(users).where(eq(users.email, 'demo@thoughtmarks.app')).limit(1);
    let user = demoUser[0];

    if (!user) {
      // Try to find by firebaseUid in case email changed
      const byFirebase = await db.select().from(users).where(eq(users.firebaseUid, 'demo-firebase-uid')).limit(1);
      user = byFirebase[0];
    }

    if (!user) {
      console.log('Demo user not found, creating...');
      const newUser = await db.insert(users).values({
        email: 'demo@thoughtmarks.app',
        displayName: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
        isPremium: true,
        isTestUser: true,
        premiumExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        firebaseUid: 'demo-firebase-uid-' + Date.now(), // ensure unique
      }).returning();
      user = newUser[0];
      console.log('Created demo user:', user);
    }

    if (!user) {
      console.error('Could not find or create demo user');
      return;
    }

    console.log('Using demo user:', user.id);

    // Clear existing content
    console.log('Clearing existing content...');
    await db.delete(thoughtmarks).where(eq(thoughtmarks.userId, user.id));
    await db.delete(bins).where(eq(bins.userId, user.id));
    console.log('Existing content cleared');

    // Create default bins - matching dashboard order from web app
    const defaultBins = [
      { name: "Examples", description: "Sample thoughtmarks to help you get started", color: "#C6D600", icon: "folder-outline", userId: user.id, sortOrder: 1 },
      { name: "Sort Later", description: "Temporarily store thoughtmarks to organize later", color: "#6B7280", icon: "folder-outline", userId: user.id, sortOrder: 2 },
      { name: "Relevant", description: "Important and timely information", color: "#3B82F6", icon: "folder-outline", userId: user.id, sortOrder: 3 },
      { name: "Life Hacks", description: "Tips and tricks for daily life", color: "#10B981", icon: "folder-outline", userId: user.id, sortOrder: 4 },
      { name: "Quotes", description: "Inspiring and memorable quotes", color: "#F59E0B", icon: "folder-outline", userId: user.id, sortOrder: 5 },
      { name: "Inspiration", description: "Motivational content and ideas", color: "#8B5CF6", icon: "folder-outline", userId: user.id, sortOrder: 6 },
      { name: "Circle Back", description: "Items to revisit later", color: "#EF4444", icon: "folder-outline", userId: user.id, sortOrder: 7 },
      { name: "Revelations", description: "Breakthrough insights and discoveries", color: "#EC4899", icon: "folder-outline", userId: user.id, sortOrder: 8 },
      { name: "Funny", description: "Humorous content and jokes", color: "#F97316", icon: "folder-outline", userId: user.id, sortOrder: 9 },
      { name: "Stories", description: "Interesting narratives and anecdotes", color: "#84CC16", icon: "folder-outline", userId: user.id, sortOrder: 10 },
      { name: "Half-Baked", description: "Ideas in development", color: "#06B6D4", icon: "folder-outline", userId: user.id, sortOrder: 11 },
      { name: "Team-Up", description: "Collaboration opportunities", color: "#8B5CF6", icon: "folder-outline", userId: user.id, sortOrder: 12 },
      { name: "Newsworthy", description: "Current events and news", color: "#DC2626", icon: "folder-outline", userId: user.id, sortOrder: 13 },
    ];

    const createdBins: any[] = [];
    for (const binData of defaultBins) {
      const result = await db.insert(bins).values(binData).returning();
      const bin = Array.isArray(result) ? result[0] : result;
      if (bin) createdBins.push(bin);
      console.log(`Created bin: ${binData.name} (ID: ${bin.id})`);
    }

    // Create template thoughtmarks using the first created bin ID (Examples bin)
    const defaultBinId = createdBins[0]?.id;
    
    if (!defaultBinId) {
      console.error('No bins created, cannot create thoughtmarks');
      return;
    }
    
    const templateThoughtmarks = [
      // Core welcome thoughtmark
      {
        title: "Welcome to Thoughtmarks!",
        content: "Welcome to your personal knowledge management system! This is your first thoughtmark - a place to capture ideas, insights, and thoughts that matter to you.\n\nHere's how to get started:\n• Tap the bright NEW THOUGHTMARK button to capture ideas\n• Organize thoughts into Collections (Bins) for different topics\n• Use tags for cross-cutting themes\n• Try the AI Tools for smart insights and connections\n• Voice record thoughts on-the-go\n\nThis welcome message is pinned to the top so you can always reference it. Happy thinking!",
        tags: ["welcome", "tutorial", "getting-started"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: true,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      // Task examples
      {
        title: "Call dentist for appointment",
        content: "Schedule routine cleaning and checkup. Prefer morning appointments if available.",
        tags: ["health", "appointments"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: true,
        isCompleted: false,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days overdue
        attachments: [],
      },
      {
        title: "Research vacation destinations",
        content: "Look into beach resorts in Costa Rica and Portugal. Compare prices for spring travel.",
        tags: ["travel", "vacation", "research"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: true,
        isCompleted: false,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        attachments: [],
      },
      {
        title: "Learn how to delete example thoughtmarks",
        content: "Visit the 'All Thoughtmarks' page to see all your thoughtmarks. After viewing them, you'll get a popup asking if you want to delete all example thoughtmarks at once. You can also delete individual thoughtmarks by tapping the three dots menu on any thoughtmark card.",
        tags: ["tutorial", "deletion", "cleanup"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: true,
        isCompleted: false,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due in 1 day
        attachments: [],
      },
      // Quote thoughtmarks
      {
        title: "Creative Awareness",
        content: "The universe is only as large as our perception of it. When we cultivate our awareness, we are expanding the universe. This expands the scope of what we have to work with and what can work through us.",
        tags: ["quotes", "philosophy", "mindfulness"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      {
        title: "The Compound Effect of Small Decisions", 
        content: "Every choice you make has a compound effect. Small decisions, consistently made, create massive results over time. Focus on systems, not goals.",
        tags: ["quotes", "wisdom", "decisions"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      // Innovation and ideas
      {
        title: "AI Innovation Ideas",
        content: "• Voice-activated personal assistant that learns your preferences\n• Smart home integration with natural language commands\n• Automated task scheduling based on calendar patterns\n• Context-aware reminder system\n• Collaborative workspace with real-time insights",
        tags: ["ai", "innovation", "technology", "ideas"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      // Humor and personal
      {
        title: "Funny office conversation overheard",
        content: "Manager: 'We need to think outside the box.'\nEmployee: 'What if we just get a bigger box?'\nManager: 'You're promoted.'",
        tags: ["funny", "office", "humor"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      // Practical and lifestyle
      {
        title: "Book recommendation: Atomic Habits",
        content: "Small changes compound over time. James Clear's approach to habit formation through identity-based habits rather than outcome-based habits is revolutionary.",
        tags: ["books", "habits", "self-improvement"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      {
        title: "Weekend camping gear checklist",
        content: "• Tent and sleeping bag\n• Portable water filter\n• First aid kit\n• Headlamp with extra batteries\n• Weather-appropriate clothing\n• Non-perishable food\n• Multi-tool or knife",
        tags: ["camping", "outdoors", "checklist"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
      {
        title: "Flow State Triggers",
        content: "What puts me in flow:\n• Early morning work sessions\n• Classical music or nature sounds\n• Clean, minimal workspace\n• Challenging but achievable tasks\n• No notifications or distractions",
        tags: ["productivity", "flow", "focus"],
        binId: defaultBinId,
        userId: user.id,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: null,
        attachments: [],
      },
    ];

    // Insert template thoughtmarks
    for (const thoughtmark of templateThoughtmarks) {
      try {
        const result = await db.insert(thoughtmarks).values(thoughtmark).returning();
        const createdThoughtmark = Array.isArray(result) ? result[0] : result;
        console.log(`Created thoughtmark: ${thoughtmark.title}`);
      } catch (error) {
        console.error('Error inserting thoughtmark:', thoughtmark.title, error);
      }
    }

    console.log(`Successfully created template with ${templateThoughtmarks.length} thoughtmarks and ${createdBins.length} bins`);
    console.log('Template content creation complete!');

  } catch (error) {
    console.error('Error creating template content:', error);
  } finally {
    process.exit(0);
  }
}

addTemplateContent(); 