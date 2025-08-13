export interface AppState {
  // Core app state
  isAuthenticated: boolean;
  user: any | null;
  theme: 'light' | 'dark';
  
  // Feature flags
  premiumEnabled: boolean;
  voiceRecordingEnabled: boolean;
  
  // Navigation state
  currentRoute: string;
  navigationReady: boolean;
  
  // Device state
  androidId?: string;
  deviceInfo: any;
  
  // API state
  apiClient: any;
  
  // Add other properties as needed
}
