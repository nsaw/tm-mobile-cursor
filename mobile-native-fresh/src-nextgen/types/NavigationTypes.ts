export interface RootStackParamList {
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
}

export interface TabParamList {
  Home: undefined;
  Dashboard: undefined;
  Search: undefined;
  Profile: undefined;
  Settings: undefined;
} 