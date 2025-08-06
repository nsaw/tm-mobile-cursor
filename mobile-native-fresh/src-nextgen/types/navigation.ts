export type AppRoutes = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Settings: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  AllBins: undefined;
  Search: undefined;
  ThoughtmarkDetail: { id: string };
  CreateBin: undefined;
  PasswordReset: undefined;
  NotificationSettings: undefined;
  PrivacyScreen: undefined;
  ThemeScreen: undefined;
  PerformanceScreen: undefined;
  AboutScreen: undefined;
  HelpScreen: undefined;
};

export type NavigationParams = {
  [K in keyof AppRoutes]: AppRoutes[K];
};

export type RootStackParamList = NavigationParams;

export type NavigationProp<T extends keyof AppRoutes> = {
  navigate: (route: T, params?: AppRoutes[T]) => void;
  goBack: () => void;
  canGoBack: () => boolean;
}; 