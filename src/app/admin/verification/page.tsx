'use client';

import { useState, useEffect } from 'react';
import { businessApi } from '@/lib/api';
import { Business } from '@/types';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const router = useRouter();
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadPendingBusinesses();
  }, []);

  const loadPendingBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const businesses = await businessApi.getPending();
      setPendingBusinesses(businesses);
    } catch (error) {
      console.error('Error loading pending businesses:', error);
      setError('Error al cargar los negocios pendientes. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas aprobar este negocio? Será publicado en el directorio.')) {
      return;
    }

    try {
      setProcessingId(id);
      await businessApi.approve(id);
      // Recargar la lista después de aprobar
      await loadPendingBusinesses();
    } catch (error) {
      console.error('Error approving business:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al aprobar el negocio. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('¿Por qué rechazas este negocio? (Opcional)');
    
    if (reason === null) {
      return; // Usuario canceló
    }

    if (!confirm('¿Estás seguro de que deseas rechazar este negocio? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setProcessingId(id);
      await businessApi.reject(id);
      // Recargar la lista después de rechazar
      await loadPendingBusinesses();
    } catch (error) {
      console.error('Error rejecting business:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al rechazar el negocio. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadPendingBusinesses}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verificación de Negocios</h2>
        <p className="text-gray-600 mt-1">
          Revisa y aprueba los negocios pendientes de publicación
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Total pendientes: {pendingBusinesses.length}
        </p>
      </div>

      {pendingBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No hay negocios pendientes de verificación</p>
          <p className="text-gray-400 text-sm mt-2">Todos los negocios han sido revisados</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Imagen principal */}
                  {business.images && business.images.length > 0 && (
                    <div className="flex-shrink-0">
                      <img
                        src={business.images[0].image_url}
                        alt={business.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Información del negocio */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{business.name}</h3>
                        {business.category_name && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {business.category_name}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full whitespace-nowrap">
                        Pendiente
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{business.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      {business.address && (
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600">{business.address}</span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-600">{business.phone}</span>
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600">{business.email}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                            {business.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Registrado el: {formatDate(business.created_at)}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => router.push(`/businesses/${business.id}`)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => handleApprove(business.id)}
                        disabled={processingId === business.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === business.id ? 'Aprobando...' : '✓ Aprobar'}
                      </button>
                      <button
                        onClick={() => handleReject(business.id)}
                        disabled={processingId === business.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === business.id ? 'Rechazando...' : '✗ Rechazar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

