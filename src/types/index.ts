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
