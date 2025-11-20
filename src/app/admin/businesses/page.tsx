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
      // Usar getAllForAdmin para ver todos los negocios (incluyendo pendientes y rechazados)
      const businessesData = await businessApi.getAllForAdmin();
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
    <div className="p-6 sm:p-8">
      {/* Header mejorado */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Directorios</h2>
            <p className="text-gray-600">
              Gestiona todos los negocios registrados en el sistema
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-semibold text-blue-800">
                {filteredBusinesses.length} Total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda mejorada */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, dirección, email o categoría..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {paginatedBusinesses.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
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
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron resultados' : 'No hay directorios registrados'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los directorios aparecerán aquí una vez que sean registrados'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
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
                    Estado
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
                  <tr key={business.id} className="hover:bg-blue-50/50 transition-colors">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        business.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : business.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.status === 'approved' ? 'Aprobado' : business.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                      </span>
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

