'use client';

import { useState, useEffect } from 'react';
import { healthApi } from '@/lib/api';

interface HealthStatus {
  status: 'checking' | 'healthy' | 'unhealthy' | 'error';
  message: string;
  lastChecked: Date | null;
}

export default function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'checking',
    message: 'Verificando estado del API...',
    lastChecked: null,
  });

  const checkHealth = async () => {
    setHealthStatus({
      status: 'checking',
      message: 'Verificando estado del API...',
      lastChecked: null,
    });

    try {
      const response = await healthApi.check();
      setHealthStatus({
        status: 'healthy',
        message: response.message || 'API funcionando correctamente',
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error('Health check error:', error);
      let errorMessage = 'Error al conectar con el API';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Si el mensaje menciona la URL, lo mantenemos, si no, agregamos más contexto
        if (!errorMessage.includes('http')) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          errorMessage += ` (${apiUrl})`;
        }
      }
      
      setHealthStatus({
        status: 'error',
        message: errorMessage,
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    checkHealth();
    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
      case 'unhealthy':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'checking':
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className="font-semibold">Estado del API</div>
            <div className="text-sm opacity-90">{healthStatus.message}</div>
            {healthStatus.lastChecked && (
              <div className="text-xs opacity-75 mt-1">
                Última verificación: {healthStatus.lastChecked.toLocaleTimeString('es-ES')}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={checkHealth}
          disabled={healthStatus.status === 'checking'}
          className="px-3 py-1 text-sm font-medium rounded-md bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Verificar estado del API"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}

