'use client';

import { useState, useEffect } from 'react';
import { businessApi } from '@/lib/api';
import { Business } from '@/types';
import { useRouter } from 'next/navigation';

export default function BusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const businessesData = await businessApi.getAll();
      setBusinesses(businessesData);
    } catch (error) {
      console.error('Error loading businesses:', error);
      setError('Error al cargar los directorios. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    try {
      setDeletingId(id);
      await businessApi.delete(id);
      // Recargar la lista después de eliminar
      await loadBusinesses();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting business:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al eliminar el directorio. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      business.name.toLowerCase().includes(searchLower) ||
      business.description?.toLowerCase().includes(searchLower) ||
      business.address?.toLowerCase().includes(searchLower) ||
      business.email?.toLowerCase().includes(searchLower) ||
      business.category_name?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

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
            onClick={loadBusinesses}
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Directorios</h2>
          <p className="text-gray-600 mt-1">
            Total: {filteredBusinesses.length} directorio{filteredBusinesses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, dirección, email o categoría..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {paginatedBusinesses.length === 0 ? (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No se encontraron directorios con ese criterio' : 'No hay directorios registrados'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{business.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{business.category_name || 'Sin categoría'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={business.address || ''}>
                        {business.address || 'Sin dirección'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{business.email || 'Sin email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(business.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => router.push(`/businesses/${business.id}`)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => router.push(`/businesses/${business.id}/edit`)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Editar
                        </button>
                        {confirmDelete === business.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(business.id)}
                              disabled={deletingId === business.id}
                              className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                            >
                              {deletingId === business.id ? 'Eliminando...' : 'Confirmar'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(business.id)}
                            disabled={deletingId === business.id}
                            className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredBusinesses.length)} de {filteredBusinesses.length} directorios
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

