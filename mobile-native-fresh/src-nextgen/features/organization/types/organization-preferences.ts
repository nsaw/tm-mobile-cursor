export interface OrganizationPreferences {
  id: string;
  userId: string;
  dashboardLayout: DashboardLayout;
  themePreferences: ThemePreferences;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  accessibilitySettings: AccessibilitySettings;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  showRecentThoughtmarks: boolean;
  showTasks: boolean;
  showBins: boolean;
  showTags: boolean;
  showStats: boolean;
  sectionOrder: string[];
  compactMode: boolean;
}

export interface ThemePreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  showAnimations: boolean;
  highContrast: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  taskReminders: boolean;
  aiInsights: boolean;
  marketingEmails: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface PrivacySettings {
  dataSharing: boolean;
  analyticsEnabled: boolean;
  crashReporting: boolean;
  locationServices: boolean;
}

export interface AccessibilitySettings {
  screenReader: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  voiceControl: boolean;
}
