export interface AppConfig {
  appId: string;
  appName: string;
  version: string;
  buildNumber: string;
  bundleIdentifier: string;
  teamId: string;
  deploymentTarget: string;
  capabilities: NativeCapabilities;
  permissions: AppPermissions;
  features: AppFeatures;
}

export interface NativeCapabilities {
  pushNotifications: boolean;
  backgroundModes: string[];
  deviceCapabilities: string[];
  entitlements: string[];
}

export interface AppPermissions {
  camera: PermissionConfig;
  microphone: PermissionConfig;
  location: PermissionConfig;
  notifications: PermissionConfig;
  contacts: PermissionConfig;
  photos: PermissionConfig;
  calendar: PermissionConfig;
}

export interface PermissionConfig {
  enabled: boolean;
  usageDescription: string;
  required: boolean;
}

export interface AppFeatures {
  inAppPurchases: boolean;
  pushNotifications: boolean;
  backgroundProcessing: boolean;
  fileSharing: boolean;
  deepLinking: boolean;
  universalLinks: boolean;
}

export const appConfig: AppConfig = {
  appId: 'com.thoughtmarks.app',
  appName: 'Thoughtmarks',
  version: '1.4.6520',
  buildNumber: '42',
  bundleIdentifier: 'com.thoughtmarks.app',
  teamId: 'YOUR_TEAM_ID',
  deploymentTarget: '13.0',
  capabilities: {
    pushNotifications: true,
    backgroundModes: ['remote-notification', 'background-processing'],
    deviceCapabilities: ['armv7', 'arm64'],
    entitlements: [
      'com.apple.developer.team-identifier',
      'com.apple.developer.aps-environment',
      'com.apple.developer.in-app-payments',
    ],
  },
  permissions: {
    camera: {
      enabled: true,
      usageDescription: 'Camera access is required to capture photos and scan QR codes',
      required: false,
    },
    microphone: {
      enabled: true,
      usageDescription: 'Microphone access is required for voice recording features',
      required: false,
    },
    location: {
      enabled: false,
      usageDescription: 'Location access is not currently used',
      required: false,
    },
    notifications: {
      enabled: true,
      usageDescription: 'Notifications help you stay updated with your thoughtmarks',
      required: false,
    },
    contacts: {
      enabled: false,
      usageDescription: 'Contact access is not currently used',
      required: false,
    },
    photos: {
      enabled: true,
      usageDescription: 'Photo access is required to save and share thoughtmarks',
      required: false,
    },
    calendar: {
      enabled: false,
      usageDescription: 'Calendar access is not currently used',
      required: false,
    },
  },
  features: {
    inAppPurchases: true,
    pushNotifications: true,
    backgroundProcessing: true,
    fileSharing: true,
    deepLinking: true,
    universalLinks: true,
  },
};
