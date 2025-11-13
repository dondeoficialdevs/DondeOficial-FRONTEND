import axios, { AxiosError } from 'axios';
import { Business, BusinessImage, Category, ApiResponse, BusinessFilters, Lead, NewsletterSubscriber } from '@/types';

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
      console.error('API URL:', API_URL);
      
      // Mensaje más descriptivo
      let message = 'No se pudo conectar con el servidor. ';
      if (error.code === 'ECONNREFUSED') {
        message += 'El servidor backend no está disponible. Verifica que esté corriendo en ' + API_URL;
      } else if (error.code === 'ERR_NETWORK') {
        message += 'Error de red. Verifica tu conexión a internet y que el backend esté accesible.';
      } else {
        message += 'Verifica que el backend esté corriendo y accesible en ' + API_URL;
      }
      
      return Promise.reject(new Error(message));
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

  // Crear nuevo negocio con imágenes (multipart/form-data)
  create: async (businessData: Partial<Business>, images?: File[]): Promise<Business> => {
    const formData = new FormData();
    
    // Agregar campos del negocio
    Object.keys(businessData).forEach((key) => {
      const value = businessData[key as keyof Business];
      // Solo agregar campos que tengan valor y no sean 'images'
      if (value !== undefined && value !== null && value !== '' && key !== 'images') {
        formData.append(key, String(value));
      }
    });
    
    // Agregar imágenes si existen
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post<ApiResponse<Business>>('/businesses', formData, {
      headers: {
        'Content-Type': undefined, // Dejar que Axios establezca automáticamente el Content-Type con boundary
      },
    });
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

  // Agregar imágenes a un negocio existente
  addImages: async (id: number, images: File[]): Promise<BusinessImage[]> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    const response = await api.post<ApiResponse<BusinessImage[]>>(`/businesses/${id}/images`, formData, {
      headers: {
        'Content-Type': undefined, // Dejar que Axios establezca automáticamente el Content-Type con boundary
      },
    });
    return response.data.data;
  },

  // Eliminar una imagen específica
  deleteImage: async (businessId: number, imageId: number): Promise<void> => {
    await api.delete(`/businesses/${businessId}/images/${imageId}`);
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

  // Obtener todos los leads
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Lead[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const url = `/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<ApiResponse<Lead[]>>(url);
    return response.data.data;
  },

  // Obtener lead por ID
  getById: async (id: number): Promise<Lead> => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },
};

export const newsletterApi = {
  // Suscribirse al newsletter
  subscribe: async (email: string): Promise<NewsletterSubscriber> => {
    const response = await api.post<ApiResponse<NewsletterSubscriber>>('/newsletter/subscribe', { email });
    return response.data.data;
  },

  // Obtener todos los suscriptores
  getAllSubscribers: async (params?: { limit?: number; offset?: number }): Promise<NewsletterSubscriber[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const url = `/newsletter/subscribers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<ApiResponse<NewsletterSubscriber[]>>(url);
    return response.data.data;
  },

  // Eliminar suscriptor
  deleteSubscriber: async (id: number): Promise<void> => {
    await api.delete(`/newsletter/subscribers/${id}`);
  },
};

// Health check endpoint
export const healthApi = {
  // Verificar estado del API
  check: async (): Promise<{ message: string; status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};