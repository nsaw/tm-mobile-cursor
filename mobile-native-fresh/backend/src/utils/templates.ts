import { db } from '../db';
import { bins, thoughtmarks } from '../db/schema';

export interface TemplateBin {
  name: string;
  description: string;
  color: string;
  icon: string;
  sortOrder: number;
}

export interface TemplateThoughtmark {
  title: string;
  content: string;
  tags: string[];
  binName: string; // References the bin by name
  isTask: boolean;
  isPinned: boolean;
  dueDate?: string;
}

// Template bins that every new user gets
export const templateBins: TemplateBin[] = [
  {
    name: 'Getting Started',
    description: 'Welcome and onboarding content to help you get started',
    color: '#3B82F6',
    icon: '🚀',
    sortOrder: 1,
  },
  {
    name: 'Work & Projects',
    description: 'Professional tasks and project-related items',
    color: '#10B981',
    icon: 'briefcase-outline',
    sortOrder: 2,
  },
  {
    name: 'Personal',
    description: 'Personal tasks and reminders',
    color: '#F59E0B',
    icon: 'person-outline',
    sortOrder: 3,
  },
  {
    name: 'Ideas & Notes',
    description: 'Random ideas and quick notes',
    color: '#8B5CF6',
    icon: 'bulb-outline',
    sortOrder: 4,
  },
  {
    name: 'Tasks & Reminders',
    description: 'Things you need to do',
    color: '#EF4444',
    icon: 'checkmark-circle-outline',
    sortOrder: 5,
  },
];

// Template thoughtmarks that every new user gets
export const templateThoughtmarks: TemplateThoughtmark[] = [
  {
    title: 'Welcome to Thoughtmarks! 🎉',
    content: `Welcome to your new digital workspace! Thoughtmarks helps you capture, organize, and connect your ideas, tasks, and notes.

Here's what you can do:
• Create thoughtmarks for any idea, task, or note
• Organize them into bins (categories)
• Add tags for easy searching
• Pin important items to the top
• Mark items as tasks with due dates

Start by creating your first thoughtmark or exploring the example content below!`,
    tags: ['welcome', 'onboarding', 'getting-started'],
    binName: 'Getting Started',
    isTask: false,
    isPinned: true,
  },
  {
    title: 'How to Use Bins',
    content: `Bins are like folders that help you organize your thoughtmarks. You can:

• Create new bins with custom colors and icons
• Drag thoughtmarks between bins
• Use bins to group related content
• Archive bins you don't use often

Try creating a new bin for a specific project or topic!`,
    tags: ['how-to', 'bins', 'organization'],
    binName: 'Getting Started',
    isTask: false,
    isPinned: false,
  },
  {
    title: 'Using Tags Effectively',
    content: `Tags help you find and connect related thoughtmarks across different bins. Some tips:

• Use consistent tag names (e.g., always "work" not "work" and "job")
• Keep tags short and descriptive
• Use tags for topics, projects, or contexts
• You can search by tags to find related content

Example tags: #work, #personal, #ideas, #tasks, #meeting-notes`,
    tags: ['how-to', 'tags', 'search'],
    binName: 'Getting Started',
    isTask: false,
    isPinned: false,
  },
  {
    title: 'Example Work Task',
    content: 'This is an example of a work-related task. You can mark thoughtmarks as tasks and set due dates to keep track of what needs to be done.',
    tags: ['example', 'work', 'task'],
    binName: 'Work & Projects',
    isTask: true,
    isPinned: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
  },
  {
    title: 'Example Personal Note',
    content: 'This is an example of a personal note. You can use thoughtmarks for anything from grocery lists to journal entries to important reminders.',
    tags: ['example', 'personal', 'note'],
    binName: 'Personal',
    isTask: false,
    isPinned: false,
  },
  {
    title: 'Example Idea',
    content: 'This is an example of an idea or concept. Use the Ideas & Notes bin to capture random thoughts, creative concepts, or things you want to explore later.',
    tags: ['example', 'ideas', 'creative'],
    binName: 'Ideas & Notes',
    isTask: false,
    isPinned: false,
  },
  {
    title: 'Example Reminder Task',
    content: 'This is an example of a reminder task. You can set due dates and mark items as tasks to keep track of important deadlines and to-dos.',
    tags: ['example', 'reminder', 'task'],
    binName: 'Tasks & Reminders',
    isTask: true,
    isPinned: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  },
];

// Function to create template content for a new user
export const createTemplateContent = async (userId: number) => {
  try {
    // Create default bins - matching dashboard order from web app
    const defaultBins = [
      { name: "Examples", description: "Sample thoughtmarks to help you get started", color: "#C6D600", icon: "folder-outline", userId, sortOrder: 1 },
      { name: "Sort Later", description: "Temporarily store thoughtmarks to organize later", color: "#6B7280", icon: "folder-outline", userId, sortOrder: 2 },
      { name: "Relevant", description: "Important and timely information", color: "#3B82F6", icon: "folder-outline", userId, sortOrder: 3 },
      { name: "Life Hacks", description: "Tips and tricks for daily life", color: "#10B981", icon: "folder-outline", userId, sortOrder: 4 },
      { name: "Quotes", description: "Inspiring and memorable quotes", color: "#F59E0B", icon: "folder-outline", userId, sortOrder: 5 },
      { name: "Inspiration", description: "Motivational content and ideas", color: "#8B5CF6", icon: "folder-outline", userId, sortOrder: 6 },
      { name: "Circle Back", description: "Items to revisit later", color: "#EF4444", icon: "folder-outline", userId, sortOrder: 7 },
      { name: "Revelations", description: "Breakthrough insights and discoveries", color: "#EC4899", icon: "folder-outline", userId, sortOrder: 8 },
      { name: "Funny", description: "Humorous content and jokes", color: "#F97316", icon: "folder-outline", userId, sortOrder: 9 },
      { name: "Stories", description: "Interesting narratives and anecdotes", color: "#84CC16", icon: "folder-outline", userId, sortOrder: 10 },
      { name: "Half-Baked", description: "Ideas in development", color: "#06B6D4", icon: "folder-outline", userId, sortOrder: 11 },
      { name: "Team-Up", description: "Collaboration opportunities", color: "#8B5CF6", icon: "folder-outline", userId, sortOrder: 12 },
      { name: "Newsworthy", description: "Current events and news", color: "#DC2626", icon: "folder-outline", userId, sortOrder: 13 },
    ];

    const createdBins = [];
    for (const binData of defaultBins) {
      const result = await db.insert(bins).values(binData).returning();
      const bin = Array.isArray(result) ? result[0] : result;
      if (bin) createdBins.push(bin);
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
    return { bins: createdBins, thoughtmarks: templateThoughtmarks };
  } catch (error) {
    console.error('Error creating template content:', error);
    throw error;
  }
}; 