// App configuration migrated from legacy
export const APP_CONFIG = {
  name: 'ThoughtMarks',
  version: '1.4.0',
  buildNumber: '1',
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.thoughtmarks.app',
    timeout: 30000,
  },
  features: {
    aiEnabled: true,
    voiceRecording: true,
    premiumFeatures: true,
  },
  storage: {
    maxThoughtmarks: 1000,
    maxBins: 50,
  },
};
