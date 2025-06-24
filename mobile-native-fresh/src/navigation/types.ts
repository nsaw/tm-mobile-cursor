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
  
  // Thoughtmarks Screens
  AllThoughtmarks: { 
    filter?: 'tasks' | 'bin' | 'tag';
    binId?: number;
    binName?: string;
    tag?: string;
  };
  ThoughtmarkDetail: { thoughtmarkId: number };
  CreateThoughtmark: { thoughtmarkId?: number };
  ThoughtmarkEdit: { thoughtmarkId: number };
  
  // Bins Screens
  AllBins: undefined;
  BinDetail: { binId: number; binName: string };
  CreateBin: undefined;
  
  // Other Screens
  Tasks: undefined;
  Bins: undefined;
  Thoughtmarks: undefined;
  VoiceRecord: undefined;
  Content: undefined;
  DesignSystemDemo: undefined;
  
  // Loading
  Loading: undefined;
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
