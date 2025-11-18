export interface BusinessImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  created_at?: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  category_id?: number;
  category_name?: string;
  opening_hours?: string;
  latitude?: number;
  longitude?: number;
  images?: BusinessImage[];
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface BusinessFilters {
  search?: string;
  category?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

export interface Lead {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}