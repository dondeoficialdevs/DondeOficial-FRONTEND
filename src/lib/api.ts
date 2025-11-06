import axios, { AxiosError } from 'axios';
import { Business, Category, ApiResponse, BusinessFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Si hay un error de red o el servidor no responde
    if (error instanceof AxiosError && !error.response) {
      const errorMessage = error.message || 'Network error';
      console.error('Network error:', errorMessage);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Si hay un error del servidor, devolver el mensaje del servidor
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      return Promise.reject(new Error(message));
    }
    
    // Si es otro tipo de error
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const businessApi = {
  // Obtener todos los negocios con filtros opcionales
  getAll: async (filters?: BusinessFilters): Promise<Business[]> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await api.get<ApiResponse<Business[]>>(`/businesses?${params.toString()}`);
    return response.data.data;
  },

  // Obtener negocio por ID
  getById: async (id: number): Promise<Business> => {
    const response = await api.get<ApiResponse<Business>>(`/businesses/${id}`);
    return response.data.data;
  },

  // Crear nuevo negocio
  create: async (businessData: Partial<Business>): Promise<Business> => {
    const response = await api.post<ApiResponse<Business>>('/businesses', businessData);
    return response.data.data;
  },

  // Actualizar negocio
  update: async (id: number, businessData: Partial<Business>): Promise<Business> => {
    const response = await api.put<ApiResponse<Business>>(`/businesses/${id}`, businessData);
    return response.data.data;
  },

  // Eliminar negocio
  delete: async (id: number): Promise<void> => {
    await api.delete(`/businesses/${id}`);
  },
};

export const categoryApi = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  // Obtener categoría por ID
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  // Crear nueva categoría
  create: async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return response.data.data;
  },
};

interface Lead {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export const leadsApi = {
  // Crear nuevo lead (formulario de contacto)
  create: async (leadData: {
    full_name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<Lead> => {
    const response = await api.post<ApiResponse<Lead>>('/leads', leadData);
    return response.data.data;
  },
};

export const newsletterApi = {
  // Suscribirse al newsletter
  subscribe: async (email: string): Promise<NewsletterSubscriber> => {
    const response = await api.post<ApiResponse<NewsletterSubscriber>>('/newsletter/subscribe', { email });
    return response.data.data;
  },
};