import axios, { AxiosError } from 'axios';
import { Business, BusinessImage, Category, ApiResponse, BusinessFilters, Lead, NewsletterSubscriber, LoginResponse, User, Review, ReviewRating } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener tokens del sessionStorage
const getTokens = () => {
  if (typeof window === 'undefined') return null;
  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
};

// Función para guardar tokens en sessionStorage
const setTokens = (tokens: { accessToken: string; refreshToken: string }) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('accessToken', tokens.accessToken);
  sessionStorage.setItem('refreshToken', tokens.refreshToken);
};

// Función para eliminar tokens del sessionStorage
const clearTokens = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user');
};

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const tokens = getTokens();
    if (tokens && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || undefined);
    }
  });
  failedQueue = [];
};

// Interceptor combinado para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // Manejo de refresh token para errores 401
    if (error instanceof AxiosError) {
      type RequestConfig = NonNullable<AxiosError['config']> & { _retry?: boolean };
      const originalRequest = error.config as RequestConfig | undefined;

      // Si el error es 401 y no es una petición de login/refresh
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
          // Para login/refresh, continuar con el manejo de errores normal
        } else {
          if (isRefreshing) {
            // Si ya se está refrescando, agregar a la cola
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          const tokens = getTokens();
          if (!tokens?.refreshToken) {
            clearTokens();
            processQueue(error, null);
            isRefreshing = false;
            // Redirigir a login si estamos en una página protegida
            if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
              window.location.href = '/admin/login';
            }
            // Continuar con manejo de errores normal
          } else {
            try {
              const response = await axios.post<ApiResponse<{ accessToken: string }>>(
                `${API_URL}/auth/refresh`,
                { refreshToken: tokens.refreshToken }
              );

              const { accessToken } = response.data.data;
              const newTokens = { ...tokens, accessToken };
              setTokens(newTokens);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }

              processQueue(null, accessToken);
              isRefreshing = false;

              return api(originalRequest);
            } catch (refreshError) {
              clearTokens();
              processQueue(refreshError, null);
              isRefreshing = false;
              // Redirigir a login
              if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
              }
              // Continuar con manejo de errores normal
            }
          }
        }
      }

      // Manejo de errores generales
      // Si hay un error de red o el servidor no responde
      if (!error.response) {
        const errorMessage = error.message || 'Network error';
        console.error('❌ Network error:', errorMessage);
        console.error('📍 API URL:', API_URL);
        console.error('🔍 Error code:', error.code);
        
        // Mensaje más descriptivo
        let message = 'No se pudo conectar con el servidor. ';
        if (error.code === 'ECONNREFUSED') {
          message += 'El servidor backend no está disponible. Verifica que esté corriendo en ' + API_URL;
        } else if (error.code === 'ERR_NETWORK') {
          message += 'Error de red. Verifica tu conexión a internet y que el backend esté accesible.';
        } else if (error.code === 'ETIMEDOUT') {
          message += 'El servidor tardó demasiado en responder. Verifica que el backend esté funcionando.';
        } else {
          message += 'Verifica que el backend esté corriendo y accesible en ' + API_URL;
        }
        
        return Promise.reject(new Error(message));
      }
      
      // Si hay un error del servidor, devolver el mensaje del servidor
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response?.data?.message || error.message || 'An error occurred';
        
        console.error(`❌ API Error [${status}]:`, serverMessage);
        console.error('📍 URL:', error.config?.url);
        
        // Mensajes más amigables según el código de estado
        if (status === 500) {
          const errorData = error.response?.data;
          const message = errorData?.error || errorData?.message || serverMessage;
          const code = errorData?.code;
          // Construir mensaje más informativo
          let fullMessage = message || 'Error interno del servidor. Por favor, intenta más tarde.';
          if (code) {
            fullMessage += ` (Código: ${code})`;
          }
          console.error('❌ Server Error Details:', errorData);
          return Promise.reject(new Error(fullMessage));
        } else if (status === 404) {
          return Promise.reject(new Error('Recurso no encontrado.'));
        } else if (status === 400) {
          return Promise.reject(new Error(serverMessage || 'Datos inválidos.'));
        } else if (status === 403) {
          return Promise.reject(new Error('No tienes permisos para realizar esta acción.'));
        }
        
        return Promise.reject(new Error(serverMessage));
      }
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

    const url = `/businesses?${params.toString()}`;
    console.log('🌐 Requesting:', API_URL + url);
    
    try {
      const response = await api.get<ApiResponse<Business[]>>(url);
      console.log('✅ Response received:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length || 0
      });
      
      if (!response.data.success) {
        console.warn('⚠️ API returned success: false', response.data);
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error in businessApi.getAll:', error);
      throw error;
    }
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
    const url = '/categories';
    console.log('🌐 Requesting categories:', API_URL + url);
    
    try {
      const response = await api.get<ApiResponse<Category[]>>(url);
      console.log('✅ Categories response:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length || 0
      });
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error in categoryApi.getAll:', error);
      throw error;
    }
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

export const reviewApi = {
  // Obtener todas las reseñas de un negocio
  getByBusinessId: async (businessId: number): Promise<Review[]> => {
    const response = await api.get<ApiResponse<Review[]>>(`/reviews/business/${businessId}`);
    return response.data.data || [];
  },

  // Obtener promedio de calificaciones de un negocio
  getRating: async (businessId: number): Promise<ReviewRating> => {
    const response = await api.get<ApiResponse<ReviewRating>>(`/reviews/business/${businessId}/rating`);
    return response.data.data;
  },

  // Crear nueva reseña
  create: async (reviewData: {
    business_id: number;
    rating: number;
    comment?: string;
    user_name?: string;
    user_email?: string;
  }): Promise<Review> => {
    const response = await api.post<ApiResponse<Review>>('/reviews', reviewData);
    return response.data.data;
  },

  // Eliminar reseña
  delete: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
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

// Autenticación
export const authApi = {
  // Iniciar sesión
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    const data = response.data.data;
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    const tokens = getTokens();
    if (tokens?.refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
    clearTokens();
  },

  // Refrescar access token
  refreshToken: async (): Promise<string> => {
    const tokens = getTokens();
    if (!tokens?.refreshToken) {
      throw new Error('No hay refresh token disponible');
    }
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken: tokens.refreshToken,
    });
    const { accessToken } = response.data.data;
    setTokens({ accessToken, refreshToken: tokens.refreshToken });
    return accessToken;
  },

  // Verificar token
  verify: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/verify');
    return response.data.data;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return getTokens() !== null;
  },
};