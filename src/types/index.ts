// Global type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

// Add more types as needed
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};










