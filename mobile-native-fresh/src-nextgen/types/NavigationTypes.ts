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
  CreateThoughtmark: undefined;
  EditThoughtmark: { id: string };
  CreateTask: undefined;
  EditTask: { id: string };
  BinManagement: undefined;
  SearchResults: { query: string };
  Onboarding: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  DashboardTab: undefined;
  ProfileTab: undefined;
};

export interface NavigationState {
  index: number;
  routes: NavigationRoute[];
  type: string;
  key: string;
}

export interface NavigationRoute {
  key: string;
  name: string;
  params?: any;
  state?: NavigationState;
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
  gestureEnabled?: boolean;
  animationEnabled?: boolean;
} 