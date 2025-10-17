export interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showEmail?: boolean;
  disabled?: boolean;
  testID?: string;
}

export interface UserCardStyleProps {
  variant: 'default' | 'compact' | 'detailed';
  disabled: boolean;
}










