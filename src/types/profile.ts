export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface AvatarUploadResponse {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

export interface ProfileFormData {
  name: string;
  bio: string;
  phone: string;
  location: string;
}

export type SwipeResult = 'Yes' | 'No' | 'YES!' | 'NO!';




