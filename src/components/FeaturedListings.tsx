'use client';

import { Business } from '../types';
import Link from 'next/link';

interface FeaturedListingsProps {
  businesses: Business[];
  loading: boolean;
}

export default function FeaturedListings({ businesses, loading }: FeaturedListingsProps) {
  if (loading) {
    return (
      <section className="py-20 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Negocios Destacados</h2>
            <p className="text-lg text-gray-600 mb-12">Descubre lugares increíbles cerca de ti</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Negocios Destacados</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre lugares increíbles cerca de ti. Desde restaurantes hasta museos, encuentra exactamente lo que buscas.
          </p>
        </div>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                {/* Image Section */}
                <div className="h-56 bg-linear-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  {business.category_name && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                        {business.category_name}
                      </span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                      business.opening_hours?.toLowerCase().includes('close') 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {business.opening_hours?.toLowerCase().includes('close') ? 'Cerrado' : 'Abierto'}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-linear-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Destacado
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    {business.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {business.description}
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 font-medium">(24 Reseñas)</span>
                  </div>

                  {/* Contact Info */}
                  {business.phone && (
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-600">{business.phone}</span>
                    </div>
                  )}

                  {business.address && (
                    <div className="flex items-start mb-4">
                      <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-500">{business.address}</span>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="flex items-center mb-4">
                    <span className="text-sm font-semibold text-green-600">$05.00 - $80.00</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/businesses/${business.id}`}
                      className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Ver Detalles
                    </Link>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm font-medium">Guardar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron negocios</h3>
              <p className="text-gray-500 mb-6">
                Estamos trabajando en agregar más lugares increíbles. ¡Vuelve pronto!
              </p>
              <Link
                href="/add-listing"
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Agrega Tu Negocio
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
