/**
 * User Template Configuration
 * Defines consistent styling and defaults for new users
 */

export const TAG_COLORS = [
  '#C6D600', // Bright lime
  '#FF6B6B', // Coral red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky blue
  '#96CEB4', // Mint green
  '#FECA57', // Golden yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Blue
  '#5F27CD', // Purple
  '#00D2D3', // Cyan
  '#FF9F43', // Orange
  '#10AC84', // Emerald
  '#EE5A6F', // Rose
  '#C44569', // Magenta
  '#F8B500', // Amber
  '#6C5CE7', // Lavender
  '#A55EEA', // Violet
  '#26DE81', // Green
  '#FC427B', // Hot pink
  '#FD79A8', // Light pink
  '#FDCB6E', // Peach
  '#6C5CE7', // Indigo
  '#74B9FF', // Light blue
  '#00B894', // Teal
  '#E84393', // Dark pink
  '#00CEC9', // Aqua
  '#FDCB6E', // Sand
  '#E17055', // Terracotta
  '#81ECEC', // Light cyan
  '#FAB1A0'  // Salmon
];

export const USER_TEMPLATE_CONFIG = {
  appName: "Thoughtmarks",
  tagline: "Transform your ideas into organized insights",
  defaultTheme: "dark",
  // Tag tile styling
  tagTileStyles: {
    fontSize: '8pt',
    fontFamily: 'Ubuntu',
    fontWeight: 400,
    textAlign: 'center' as const,
    textTransform: 'lowercase' as const,
    height: '75%',
    minHeight: '75%',
    borderRadius: 'rounded-sm', // halfway between rounded and rounded-md
    padding: {
      horizontal: 'px-3',
      vertical: 'py-2'
    }
  },

  // Default bins structure for new users
  defaultBins: [
    { name: "Examples", description: "Sample thoughtmarks to help you get started", color: "#C6D600", icon: "folder" },
    { name: "Sort Later", description: "Temporarily store thoughtmarks to organize later", color: "#6B7280", icon: "folder" },
    { name: "Relevant", description: "Important and timely information", color: "#3B82F6", icon: "folder" },
    { name: "Life Hacks", description: "Tips and tricks for daily life", color: "#10B981", icon: "folder" },
    { name: "Quotes", description: "Inspiring and memorable quotes", color: "#F59E0B", icon: "folder" },
    { name: "Inspiration", description: "Motivational content and ideas", color: "#8B5CF6", icon: "folder" },
    { name: "Circle Back", description: "Items to revisit later", color: "#EF4444", icon: "folder" },
    { name: "Revelations", description: "Breakthrough insights and discoveries", color: "#EC4899", icon: "folder" },
    { name: "Funny", description: "Humorous content and jokes", color: "#F97316", icon: "folder" },
    { name: "Stories", description: "Interesting narratives and anecdotes", color: "#84CC16", icon: "folder" },
    { name: "Half-Baked", description: "Ideas in development", color: "#06B6D4", icon: "folder" },
    { name: "Team-Up", description: "Collaboration opportunities", color: "#8B5CF6", icon: "folder" },
    { name: "Newsworthy", description: "Current events and news", color: "#DC2626", icon: "folder" },
  ],

  // Default thoughtmark settings
  thoughtmarkDefaults: {
    newUserDefaultBin: "Examples",
    taskDefaultBin: "Tasks",
    existingUserDefaultBin: "Sort Later",
    clickToExpandEnabled: true,
    voiceRecordingEnabled: true
  },

  // Bin ordering configuration
  binOrdering: {
    dashboardBins: [
      'Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 
      'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy'
    ],
    allBinsOrder: [
      'Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 
      'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy',
      'Examples', 'Tasks'
    ]
  },

  // UI consistency settings
  uiDefaults: {
    expandedViewRoute: '/thoughtmark/{id}',
    editRoute: '/edit/{id}',
    tagChipStyle: {
      fontSize: '8pt',
      fontFamily: 'Ubuntu',
      borderRadius: 'rounded-sm'
    },
    // Enhanced UX classes for consistent application
    scrollPhysics: 'momentum-scroll enhanced-scroll scroll-container',
    touchFeedback: 'touch-feedback haptic-feedback',
    cardAnimation: 'card-hover gpu-accelerated',
    skeletonLoader: 'skeleton-loader animate-enhanced',
    transitionClasses: 'transition-all duration-200 ease-out',
    performanceOptimization: 'gpu-accelerated will-change-transform'
  },

  // Animation and interaction presets
  animations: {
    fadeIn: 'animate-fade-in animate-enhanced',
    slideUp: 'animate-slide-up animate-enhanced',
    scaleIn: 'animate-scale-in animate-enhanced',
    bounceGentle: 'animate-bounce-gentle',
    shimmer: 'animate-shimmer',
    pulseNeon: 'animate-pulse-neon'
  }
};

/**
 * Generate tag tile CSS classes with template styling
 */
export function getTagTileClasses(isSelected: boolean = false): string {
  const baseClasses = 'cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-target flex items-center justify-center tag-chip';
  const paddingClasses = `${USER_TEMPLATE_CONFIG.tagTileStyles.padding.horizontal} ${USER_TEMPLATE_CONFIG.tagTileStyles.padding.vertical}`;
  const radiusClass = USER_TEMPLATE_CONFIG.tagTileStyles.borderRadius;
  
  const stateClasses = isSelected 
    ? "selected"
    : "hover:bg-white/12 hover:border-white/20";

  return `${baseClasses} ${paddingClasses} ${radiusClass} ${stateClasses}`;
}

/**
 * Generate tag tile inline styles with template configuration
 */
export function getTagTileStyles(): React.CSSProperties {
  return {
    fontFamily: USER_TEMPLATE_CONFIG.tagTileStyles.fontFamily,
    fontWeight: USER_TEMPLATE_CONFIG.tagTileStyles.fontWeight,
    fontSize: USER_TEMPLATE_CONFIG.tagTileStyles.fontSize,
    textTransform: USER_TEMPLATE_CONFIG.tagTileStyles.textTransform,
    height: USER_TEMPLATE_CONFIG.tagTileStyles.height,
    minHeight: USER_TEMPLATE_CONFIG.tagTileStyles.minHeight,
    textAlign: USER_TEMPLATE_CONFIG.tagTileStyles.textAlign
  };
}

/**
 * Get consistent color for a tag across the application
 */
export function getTagColor(tag: string): string {
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

/**
 * Generate tag chip styles with consistent coloring
 */
export function getTagChipStyles(tag: string, isSelected: boolean = false): React.CSSProperties {
  const tagColor = getTagColor(tag);
  return {
    backgroundColor: isSelected ? '#1e293b' : 'rgba(255, 255, 255, 0.08)',
    borderColor: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.12)',
    color: isSelected ? '#60a5fa' : '#f0f0f5',
    fontSize: USER_TEMPLATE_CONFIG.uiDefaults.tagChipStyle.fontSize,
    fontFamily: USER_TEMPLATE_CONFIG.uiDefaults.tagChipStyle.fontFamily,
    fontWeight: isSelected ? 600 : 400,
    boxShadow: 'none'
  };
}

/**
 * Get enhanced scroll physics classes
 */
export function getScrollPhysicsClasses(): string {
  return USER_TEMPLATE_CONFIG.uiDefaults.scrollPhysics;
}

/**
 * Get touch feedback classes for interactive elements
 */
export function getTouchFeedbackClasses(): string {
  return USER_TEMPLATE_CONFIG.uiDefaults.touchFeedback;
}

/**
 * Get card animation classes
 */
export function getCardAnimationClasses(): string {
  return USER_TEMPLATE_CONFIG.uiDefaults.cardAnimation;
}

/**
 * Get combined classes for optimal component performance and UX
 */
export function getOptimalComponentClasses(type: 'scroll' | 'card' | 'touch' | 'skeleton'): string {
  const baseClasses = USER_TEMPLATE_CONFIG.uiDefaults.transitionClasses;
  const performance = USER_TEMPLATE_CONFIG.uiDefaults.performanceOptimization;
  
  switch (type) {
    case 'scroll':
      return `${baseClasses} ${USER_TEMPLATE_CONFIG.uiDefaults.scrollPhysics} ${performance}`;
    case 'card':
      return `${baseClasses} ${USER_TEMPLATE_CONFIG.uiDefaults.cardAnimation} ${USER_TEMPLATE_CONFIG.uiDefaults.touchFeedback} ${performance}`;
    case 'touch':
      return `${baseClasses} ${USER_TEMPLATE_CONFIG.uiDefaults.touchFeedback} ${performance}`;
    case 'skeleton':
      return `${USER_TEMPLATE_CONFIG.uiDefaults.skeletonLoader} ${performance}`;
    default:
      return `${baseClasses} ${performance}`;
  }
}

/**
 * Get animation classes by type
 */
export function getAnimationClasses(animation: keyof typeof USER_TEMPLATE_CONFIG.animations): string {
  return USER_TEMPLATE_CONFIG.animations[animation] || '';
}

/**
 * Apply comprehensive user template with all enhancements
 */
export const applyUserTemplate = (userData: any) => {
  // Apply comprehensive UX enhancements
  document.documentElement.classList.add(
    'enhanced-ux',
    'gesture-enhanced',
    'performance-optimized',
    'settings-subpages',
    'swipe-navigation',
    'premium-features',
    'fluid-theme' // Add fluid-theme class for universal hover effect removal
  );

  // Add utility classes to body for enhanced interactions
  document.body.classList.add(
    'momentum-scroll',
    'enhanced-scroll',
    'touch-optimized',
    'gesture-ready',
    'back-navigation',
    'pin-auth-ready',
    'welcome-card-styling' // Add welcome card styling for all users
  );

  // Set dark theme as default for all users
  document.documentElement.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
  
  // Store theme preference and new settings structure
  localStorage.setItem('theme', 'dark');
  localStorage.setItem('settings-structure', 'subpages');
  localStorage.setItem('navigation-mode', 'gesture-enhanced');

  // Preload fonts for performance
  const fontPreloader = document.createElement('link');
  fontPreloader.rel = 'preload';
  fontPreloader.as = 'font';
  fontPreloader.type = 'font/woff2';
  fontPreloader.crossOrigin = 'anonymous';
  
  // Preload Ubuntu and Oswald fonts
  ['ubuntu-500.woff2', 'ubuntu-600.woff2', 'oswald-700.woff2'].forEach(font => {
    const link = fontPreloader.cloneNode(true) as HTMLLinkElement;
    link.href = `/fonts/${font}`;
    document.head.appendChild(link);
  });

  return {
    ...userData,
    theme: 'dark',
    preferences: {
      ...userData.preferences,
      theme: 'dark',
      enhancedUX: true,
      gestureNavigation: true,
      performanceMode: true,
      settingsStructure: 'subpages',
      backNavigation: true,
      swipeGestures: true,
      premiumFeatures: true,
      quickHelp: true,
      pinAuth: false, // Default disabled until user sets up
      notifications: {
        push: true,
        aiReminders: false, // Premium feature
        insights: false, // Premium feature
        marketingEmails: true // Default enabled for marketing emails
      }
    }
  };
};