import { NavigationProp as RNNavigationProp, RouteProp as RNRouteProp } from '@react-navigation/native';

// Core navigation types
export interface RootStackParamList {
  Home: undefined;
  Dashboard: undefined;
  Search: undefined;
  AllThoughtmarks: {
    filter?: 'tasks' | 'bin' | 'tag';
    binId?: string;
    tag?: string;
  } | undefined;
  AllBins: undefined;
  CreateThoughtmark: undefined;
  CreateBin: undefined;
  ThoughtmarkDetail: { id: string };
  BinDetail: { id: string };
  SignIn: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  Settings: undefined;
  Notifications: undefined;
  ThemeScreen: undefined;
  ContactScreen: undefined;
  HowToScreen: undefined;
  Loading: { isVisible: boolean };
  AITools: undefined;
  [key: string]: any;
}

// Navigation prop types
export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: RNNavigationProp<RootStackParamList, T>;
  route: RNRouteProp<RootStackParamList, T>;
};

// Deep link types
export interface DeepLinkConfig {
  scheme: string;
  host: string;
  path: string;
}

export interface NavigationState {
  index: number;
  routes: Array<{
    key: string;
    name: string;
    params?: any;
  }>;
}

// Navigation validation types
export interface NavigationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Route mismatch error types
export interface RouteMismatchError {
  expectedRoute: keyof RootStackParamList;
  actualRoute: keyof RootStackParamList;
  timestamp: number;
  context: string;
}

export interface TabParamList {
  Home: undefined;
  Search: undefined;
  AllThoughtmarks: undefined;
  Profile: undefined;
  [key: string]: any;
}

export interface NavigationAction {
  type: string;
  payload?: any;
}

export type NavigationProp<T extends keyof RootStackParamList> = {
  navigate: (screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  reset: (state: unknown) => void;
  setParams: (params: Partial<RootStackParamList[T]>) => void;
  setOptions: (options: unknown) => void;
};

export type RouteProp<T extends keyof RootStackParamList> = RNRouteProp<RootStackParamList, T>;

export interface NavigationOptions {
  title?: string;
  headerShown?: boolean;
  headerTitle?: string;
  headerBackTitle?: string;
  headerTintColor?: string;
  headerStyle?: {
    backgroundColor?: string;
    elevation?: number;
    shadowOpacity?: number;
  };
  tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  tabBarLabel?: string;
  tabBarVisible?: boolean;
} 