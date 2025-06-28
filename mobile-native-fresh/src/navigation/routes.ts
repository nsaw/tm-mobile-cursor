// Routes Manifest - Comprehensive documentation of all app routes
// This file serves as the single source of truth for all navigation routes

export const ROUTES = {
  // Authentication Routes
  AUTH: {
    SIGN_IN: 'SignIn',
    SIGN_UP: 'SignUp'
  },

  // Main App Routes
  MAIN: {
    DASHBOARD: 'Dashboard',
    SEARCH: 'Search',
    AI_TOOLS: 'AITools'
  },

  // Thoughtmarks Routes
  THOUGHTMARKS: {
    ALL: 'AllThoughtmarks',
    DETAIL: 'ThoughtmarkDetail',
    CREATE: 'CreateThoughtmark'
  },

  // Bins Routes
  BINS: {
    ALL: 'AllBins',
    CREATE: 'CreateBin',
    DETAIL: 'BinDetail'
  },

  // Tasks Routes
  TASKS: {
    ALL: 'Tasks'
  },

  // Content Routes
  CONTENT: {
    MAIN: 'Content'
  },

  // Voice Routes
  VOICE: {
    RECORD: 'VoiceRecord'
  },

  // Settings Routes
  SETTINGS: {
    MAIN: 'Settings',
    PROFILE: 'Profile',
    PREMIUM: 'Premium',
    HELP: 'Help',
    TERMS: 'Terms',
    PRIVACY: 'Privacy',
    SECURITY: 'Security',
    THEME: 'Theme',
    EXPORT: 'Export',
    CONTACT: 'Contact',
    HOW_TO: 'HowTo',
    ADMIN: 'AdminDashboard'
  },

  // Archive Routes
  ARCHIVE: {
    MAIN: 'Archive'
  },

  // Development Routes
  DEV: {
    DESIGN_SYSTEM: 'DesignSystemDemo'
  }
} as const;

// Route parameter types for type safety
export interface RouteParams {
  'ThoughtmarkDetail': { thoughtmarkId: string };
  'CreateThoughtmark': { thoughtmarkId?: string };
  'BinDetail': { binId: string };
  'CreateBin': { binId?: string };
  'Search': { query?: string; filters?: any };
  'AITools': { tool?: string };
}

// Route descriptions for documentation
export const ROUTE_DESCRIPTIONS = {
  [ROUTES.AUTH.SIGN_IN]: 'User authentication sign in screen',
  [ROUTES.AUTH.SIGN_UP]: 'User registration screen',
  [ROUTES.MAIN.DASHBOARD]: 'Main dashboard with overview of thoughtmarks, bins, and tasks',
  [ROUTES.MAIN.SEARCH]: 'Global search functionality',
  [ROUTES.MAIN.AI_TOOLS]: 'AI-powered tools and features',
  [ROUTES.THOUGHTMARKS.ALL]: 'List of all thoughtmarks with filtering and sorting',
  [ROUTES.THOUGHTMARKS.DETAIL]: 'Detailed view of a single thoughtmark',
  [ROUTES.THOUGHTMARKS.CREATE]: 'Create or edit a thoughtmark',
  [ROUTES.BINS.ALL]: 'List of all bins with their contents',
  [ROUTES.BINS.CREATE]: 'Create a new bin',
  [ROUTES.BINS.DETAIL]: 'Detailed view of a bin with its thoughtmarks',
  [ROUTES.TASKS.ALL]: 'List of all tasks',
  [ROUTES.CONTENT.MAIN]: 'Content management screen',
  [ROUTES.VOICE.RECORD]: 'Voice recording interface',
  [ROUTES.SETTINGS.MAIN]: 'Main settings screen',
  [ROUTES.SETTINGS.PROFILE]: 'User profile management',
  [ROUTES.SETTINGS.PREMIUM]: 'Premium features and subscription',
  [ROUTES.SETTINGS.HELP]: 'Help and support',
  [ROUTES.SETTINGS.TERMS]: 'Terms of service',
  [ROUTES.SETTINGS.PRIVACY]: 'Privacy policy',
  [ROUTES.SETTINGS.SECURITY]: 'Security settings',
  [ROUTES.SETTINGS.THEME]: 'Theme and appearance settings',
  [ROUTES.SETTINGS.EXPORT]: 'Data export functionality',
  [ROUTES.SETTINGS.CONTACT]: 'Contact support',
  [ROUTES.SETTINGS.HOW_TO]: 'How-to guides and tutorials',
  [ROUTES.SETTINGS.ADMIN]: 'Admin dashboard for administrators',
  [ROUTES.ARCHIVE.MAIN]: 'Archived thoughtmarks',
  [ROUTES.DEV.DESIGN_SYSTEM]: 'Design system demonstration'
} as const;

// Navigation helper functions
export const navigateTo = {
  dashboard: () => ROUTES.MAIN.DASHBOARD,
  search: (query?: string) => ({ route: ROUTES.MAIN.SEARCH, params: { query } }),
  aiTools: (tool?: string) => ({ route: ROUTES.MAIN.AI_TOOLS, params: { tool } }),
  allThoughtmarks: () => ROUTES.THOUGHTMARKS.ALL,
  thoughtmarkDetail: (id: string) => ({ route: ROUTES.THOUGHTMARKS.DETAIL, params: { thoughtmarkId: id } }),
  createThoughtmark: (id?: string) => ({ route: ROUTES.THOUGHTMARKS.CREATE, params: { thoughtmarkId: id } }),
  allBins: () => ROUTES.BINS.ALL,
  createBin: () => ROUTES.BINS.CREATE,
  binDetail: (id: string) => ({ route: ROUTES.BINS.DETAIL, params: { binId: id } }),
  allTasks: () => ROUTES.TASKS.ALL,
  voiceRecord: () => ROUTES.VOICE.RECORD,
  settings: () => ROUTES.SETTINGS.MAIN,
  profile: () => ROUTES.SETTINGS.PROFILE,
  premium: () => ROUTES.SETTINGS.PREMIUM,
  help: () => ROUTES.SETTINGS.HELP,
  terms: () => ROUTES.SETTINGS.TERMS,
  privacy: () => ROUTES.SETTINGS.PRIVACY,
  security: () => ROUTES.SETTINGS.SECURITY,
  theme: () => ROUTES.SETTINGS.THEME,
  export: () => ROUTES.SETTINGS.EXPORT,
  contact: () => ROUTES.SETTINGS.CONTACT,
  howTo: () => ROUTES.SETTINGS.HOW_TO,
  admin: () => ROUTES.SETTINGS.ADMIN,
  archive: () => ROUTES.ARCHIVE.MAIN
} as const; 