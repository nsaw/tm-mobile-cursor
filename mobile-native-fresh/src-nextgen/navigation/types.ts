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
};

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
  reset: (state: any) => void;
  setParams: (params: Partial<RootStackParamList[T]>) => void;
  setOptions: (options: any) => void;
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
    params?: any;
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