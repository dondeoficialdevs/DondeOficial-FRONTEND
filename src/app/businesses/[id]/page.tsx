'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { businessApi } from '@/lib/api';
import { Business } from '@/types';
import Link from 'next/link';

export default function BusinessDetail() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadBusiness(Number(params.id));
    }
  }, [params.id]);

  const loadBusiness = async (id: number) => {
    try {
      setLoading(true);
      const businessData = await businessApi.getById(id);
      setBusiness(businessData);
    } catch (error) {
      console.error('Error loading business:', error);
      setError('Negocio no encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negocio no encontrado</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Volver al directorio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Business Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {business.name}
                </h1>
                {business.category_name && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {business.category_name}
                  </span>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="flex space-x-4">
                  {business.website && (
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      🌐 Visitar sitio web
                    </a>
                  )}
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      📞 Llamar
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Descripción</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {business.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Información de contacto</h2>
                  <div className="space-y-3">
                    {business.address && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3 mt-1">📍</span>
                        <div>
                          <p className="font-medium text-gray-900">Dirección</p>
                          <p className="text-gray-700">{business.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {business.phone && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-3">📞</span>
                        <div>
                          <p className="font-medium text-gray-900">Teléfono</p>
                          <a
                            href={`tel:${business.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {business.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {business.email && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-3">✉️</span>
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <a
                            href={`mailto:${business.email}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {business.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {business.opening_hours && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Horarios</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-gray-700 whitespace-pre-line font-sans">
                        {business.opening_hours}
                      </pre>
                    </div>
                  </div>
                )}

                {(business.latitude && business.longitude) && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Ubicación</h2>
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-gray-500">
                        Mapa de ubicación
                        <br />
                        <span className="text-sm">
                          Lat: {business.latitude}, Lng: {business.longitude}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
