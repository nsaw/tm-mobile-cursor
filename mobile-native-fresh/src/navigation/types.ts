// src/navigation/types.ts

export type RootStackParamList = {
  // Auth Screens
  SignIn: undefined;
  SignUp: undefined;
  
  // Main Screens
  Dashboard: undefined;
  Search: undefined;
  AITools: undefined;
  Settings: undefined;
  Profile: undefined;
  Premium: undefined;
  Help: undefined;
  Terms: undefined;
  Privacy: undefined;
  Security: undefined;
  Theme: undefined;
  Export: undefined;
  Contact: undefined;
  HowTo: undefined;
  
  // Thoughtmarks Screens
  AllThoughtmarks: { 
    filter?: 'tasks' | 'bin' | 'tag';
    binId?: number;
    binName?: string;
    tag?: string;
  };
  ThoughtmarkDetail: { thoughtmarkId: string };
  CreateThoughtmark: { 
    thoughtmarkId?: number; 
    content?: string; 
    title?: string; 
    isVoiceNote?: boolean;
  };
  ThoughtmarkEdit: { thoughtmarkId: number };
  
  // Bins Screens
  AllBins: undefined;
  BinDetail: { binId: string; binName: string };
  CreateBin: undefined;
  
  // Other Screens
  Tasks: undefined;
  Bins: undefined;
  Thoughtmarks: undefined;
  VoiceRecord: undefined;
  Content: undefined;
  DesignSystemDemo: undefined;
  Archive: undefined;
  
  // Loading
  Loading: undefined;

  // New screens
  Home: undefined;
  Detail: { thoughtmarkId: string };
  UnifiedThoughtmark: { thoughtmarkId?: string } | undefined;
  AdminDashboard: undefined;
};

// Type for navigation prop
export type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  push: (screen: keyof RootStackParamList, params?: any) => void;
  pop: () => void;
  reset: (state: any) => void;
  setOptions: (options: any) => void;
};

// Type for route prop
export type RouteProp<T extends keyof RootStackParamList> = {
  params: RootStackParamList[T];
  key: string;
  name: T;
};
