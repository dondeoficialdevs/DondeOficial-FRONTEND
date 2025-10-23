import axios from 'axios';
import { Business, Category, ApiResponse, BusinessFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
