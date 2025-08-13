export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  accessibility: AccessibilitySettings;
  data: DataSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  reminders: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  crashReports: boolean;
  locationServices: boolean;
}

export interface SecuritySettings {
  biometricAuth: boolean;
  autoLock: boolean;
  lockTimeout: number;
  siriIntegration: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

export interface DataSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  exportFormat: 'json' | 'csv' | 'pdf';
  retentionPeriod: number;
}
