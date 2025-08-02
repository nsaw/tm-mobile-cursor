import { NavigationProp as RNNavigationProp, RouteProp as RNRouteProp } from '@react-navigation/native';

// Core navigation types
export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Search: undefined;
  Profile: undefined;
  Settings: undefined;
  SignIn: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
  ThoughtmarkDetail: { id: string };
  TaskDetail: { id: string };
  EditProfile: undefined;
  Notifications: undefined;
  Loading: { isVisible: boolean };
  Error: { message: string };
};

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
  currentRoute: keyof RootStackParamList;
  previousRoute?: keyof RootStackParamList;
  params?: Record<string, unknown>;
  timestamp: number;
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

export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  DashboardTab: undefined;
  ProfileTab: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> = {
  navigate: (screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  reset: (state: unknown) => void;
  setParams: (params: Partial<RootStackParamList[T]>) => void;
  setOptions: (options: unknown) => void;
};

export type RouteProp<T extends keyof RootStackParamList> = {
  key: string;
  name: T;
  params: RootStackParamList[T];
};

export interface NavigationState {
  index: number;
  routes: Array<{
    key: string;
    name: string;
    params?: unknown;
  }>;
}

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