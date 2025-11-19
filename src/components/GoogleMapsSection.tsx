'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Business, Category } from '../types';
import { categoryApi } from '../lib/api';
import Link from 'next/link';

interface GoogleMapsSectionProps {
  businesses: Business[];
  onSearch: (search: string, category?: string, location?: string) => void;
}

const defaultCenter: [number, number] = [19.4326, -99.1332]; // Ciudad de México

// Configurar iconos de Leaflet (necesario para Next.js)
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para actualizar el centro del mapa
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

// Componente para manejar clicks en el mapa
function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick]);
  return null;
}

export default function GoogleMapsSection({ businesses, onSearch }: GoogleMapsSectionProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState('Cerca de mí');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Filtrar negocios que tienen coordenadas válidas
  const businessesWithCoords = useMemo(() => {
    return businesses.filter(
      (business) => 
        business.latitude != null && 
        business.longitude != null && 
        !isNaN(Number(business.latitude)) && 
        !isNaN(Number(business.longitude)) &&
        Number(business.latitude) !== 0 &&
        Number(business.longitude) !== 0
    );
  }, [businesses]);

  // Función para calcular el centro de manera segura
  const calculateCenter = (businessesList: Business[]): [number, number] => {
    if (businessesList.length === 0) return defaultCenter;
    
    const validBusinesses = businessesList.filter(
      (b) => 
        b.latitude != null && 
        b.longitude != null && 
        !isNaN(Number(b.latitude)) && 
        !isNaN(Number(b.longitude)) &&
        Number(b.latitude) !== 0 &&
        Number(b.longitude) !== 0
    );

    if (validBusinesses.length === 0) return defaultCenter;

    const avgLat = validBusinesses.reduce((sum, b) => sum + Number(b.latitude!), 0) / validBusinesses.length;
    const avgLng = validBusinesses.reduce((sum, b) => sum + Number(b.longitude!), 0) / validBusinesses.length;

    // Validar que los resultados sean números válidos
    if (isNaN(avgLat) || isNaN(avgLng)) return defaultCenter;

    return [avgLat, avgLng];
  };

  // Calcular centro inicial
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    return calculateCenter(businessesWithCoords);
  });

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryApi.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown') && !target.closest('.menu-dropdown')) {
        setShowCategoryDropdown(false);
        setShowMenuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Detectar ubicación del usuario automáticamente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation([userLat, userLng]);
          setMapCenter([userLat, userLng]);
          setMapZoom(13); // Zoom más cercano cuando detecta ubicación
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
          setLocationError('No se pudo obtener tu ubicación');
          // Si falla, usar centro basado en negocios o default
          const newCenter = calculateCenter(businessesWithCoords);
          setMapCenter(newCenter);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Tu navegador no soporta geolocalización');
    }
  }, []);

  // Filtrar negocios según la búsqueda - usar los negocios que vienen del prop (ya filtrados por la API)
  const filteredBusinesses = useMemo(() => {
    // Si hay búsqueda activa, usar los negocios del prop (ya filtrados por la API)
    // Si no hay búsqueda, mostrar todos los negocios con coordenadas
    const businessesToFilter = (searchTerm || selectedCategory) ? businesses : businessesWithCoords;
    
    // Filtrar solo los que tienen coordenadas para mostrar en el mapa
    return businessesToFilter.filter((business) => {
      if (!business.latitude || !business.longitude) return false;
      
      // Si hay búsqueda activa, los negocios ya vienen filtrados del prop
      if (searchTerm || selectedCategory) {
        return true;
      }
      
      // Si no hay búsqueda, mostrar todos
      return true;
    });
  }, [businesses, businessesWithCoords, searchTerm, selectedCategory]);

  // Actualizar centro cuando cambien los negocios filtrados o la búsqueda
  useEffect(() => {
    if (filteredBusinesses.length > 0 && (searchTerm || selectedCategory)) {
      const newCenter = calculateCenter(filteredBusinesses);
      setMapCenter(newCenter);
      // Ajustar zoom según la cantidad de resultados
      if (filteredBusinesses.length === 1) {
        setMapZoom(15);
      } else if (filteredBusinesses.length < 5) {
        setMapZoom(13);
      } else {
        setMapZoom(12);
      }
    }
  }, [filteredBusinesses, searchTerm, selectedCategory]);

  const handleMarkerClick = (business: Business) => {
    setSelectedBusiness(business);
    if (
      business.latitude != null && 
      business.longitude != null && 
      !isNaN(Number(business.latitude)) && 
      !isNaN(Number(business.longitude))
    ) {
      setMapCenter([Number(business.latitude), Number(business.longitude)]);
      setMapZoom(15);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationToUse = location === 'Cerca de mí' ? '' : location;
    onSearch(searchTerm, selectedCategory || undefined, locationToUse);
  };

  const handleClearLocation = () => {
    setLocation('Cerca de mí');
  };

  // Función para obtener direcciones/rutas
  const handleGetDirections = (business: Business) => {
    if (!business.latitude || !business.longitude) return;
    const destination = `${business.latitude},${business.longitude}`;
    const destinationParam = business.address 
      ? encodeURIComponent(business.address)
      : destination;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Función para obtener direcciones desde la ubicación actual
  const handleGetDirectionsFromCurrentLocation = (business: Business) => {
    if (!business.latitude || !business.longitude) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = `${position.coords.latitude},${position.coords.longitude}`;
          const destination = `${business.latitude},${business.longitude}`;
          const destinationParam = business.address 
            ? encodeURIComponent(business.address)
            : destination;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationParam}`;
          window.open(googleMapsUrl, '_blank');
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          handleGetDirections(business);
        }
      );
    } else {
      handleGetDirections(business);
    }
  };

  return (
    <section className="relative bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mensaje informativo */}
        {!showSearchBar && showHint && (
          <div className="mb-4 bg-gray-100 border border-gray-300 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">
                Haz clic en el mapa para abrir el buscador
              </p>
              <button
                onClick={() => setShowHint(false)}
                className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors ml-4"
                aria-label="Cerrar mensaje"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 map-container" style={{ height: '600px' }}>
          {/* Buscador overlay que aparece encima del mapa */}
          {showSearchBar && (
            <div className="absolute top-4 left-4 right-4 z-[1000] search-bar-container">
              <div className="bg-blue-900 rounded-lg p-4 shadow-2xl">
                <div className="flex items-center gap-2">
                {/* Botón Categorías */}
                <div className="relative category-dropdown">
                  <button
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowMenuDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    <span className="font-semibold">Categorías</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.name);
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-900"
                          >
                            {category.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">Cargando categorías...</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Campo de búsqueda */}
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="¿Qué estas buscando?"
                    className="flex-1 px-4 py-2.5 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />

                  {/* Filtro de ubicación */}
                  {location && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-900 font-semibold">{location}</span>
                      <button
                        type="button"
                        onClick={handleClearLocation}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Botón de búsqueda */}
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>

                {/* Botón con menú desplegable */}
                <div className="relative menu-dropdown">
                  <button
                    onClick={() => {
                      setShowMenuDropdown(!showMenuDropdown);
                      setShowCategoryDropdown(false);
                    }}
                    className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {showMenuDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-teal-600 rounded-lg shadow-xl z-50">
                      <div className="py-2">
                        <Link href="/add-listing" className="block px-4 py-2 text-white hover:bg-teal-700 transition-colors font-semibold" onClick={() => setShowMenuDropdown(false)}>
                          ANUNCIA TU NEGOCIO
                        </Link>
                        <div className="border-t border-teal-500 my-1"></div>
                        <Link href="#" className="block px-4 py-2 text-white hover:bg-teal-700 transition-colors font-medium" onClick={() => setShowMenuDropdown(false)}>
                          HAZ CRECER TU NEGOCIO
                        </Link>
                        <Link href="/admin/login" className="block px-4 py-2 text-white hover:bg-teal-700 transition-colors font-medium" onClick={() => setShowMenuDropdown(false)}>
                          INICIAR SESIÓN
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón para cerrar el buscador */}
                <button
                  onClick={() => {
                    setShowSearchBar(false);
                    setSearchTerm('');
                    setSelectedCategory('');
                    setLocation('Cerca de mí');
                  }}
                  className="px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Cerrar buscador"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Lista de negocios encontrados */}
              {(searchTerm || selectedCategory) && filteredBusinesses.length > 0 && (
                <div className="mt-4 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900">
                      {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'negocio encontrado' : 'negocios encontrados'}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {filteredBusinesses.map((business) => (
                      <div
                        key={business.id}
                        onClick={() => {
                          handleMarkerClick(business);
                          setShowSearchBar(false);
                        }}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{business.name}</h4>
                            {business.category_name && (
                              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1">
                                {business.category_name}
                              </span>
                            )}
                            {business.address && (
                              <p className="text-xs text-gray-600 line-clamp-1 mt-1">{business.address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay resultados */}
              {(searchTerm || selectedCategory) && filteredBusinesses.length === 0 && (
                <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                  <p className="text-sm text-gray-600 text-center">
                    No se encontraron negocios con los criterios de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
          )}

          {!isNaN(mapCenter[0]) && !isNaN(mapCenter[1]) && (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            <MapClickHandler onMapClick={() => {
              setShowSearchBar(true);
              setSelectedBusiness(null);
              setShowHint(false);
            }} />
            
            {/* Marcador de ubicación del usuario */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: 'custom-user-marker',
                  html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })}
              >
                <Popup>
                  <div className="text-sm font-medium text-gray-900">
                    📍 Tu ubicación
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Marcadores de negocios */}
            {filteredBusinesses
              .filter((b) => 
                b.latitude != null && 
                b.longitude != null && 
                !isNaN(Number(b.latitude)) && 
                !isNaN(Number(b.longitude))
              )
              .map((business) => (
              <Marker
                key={business.id}
                position={[Number(business.latitude!), Number(business.longitude!)]}
                eventHandlers={{
                  click: () => handleMarkerClick(business),
                }}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {business.name}
                    </h3>
                    {business.category_name && (
                      <p className="text-sm text-blue-600 mb-2">
                        {business.category_name}
                      </p>
                    )}
                    {business.address && (
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {business.address}
                      </p>
                    )}
                    {business.phone && (
                      <p className="text-sm text-gray-600 mb-2">
                        📞 {business.phone}
                      </p>
                    )}
                    {business.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGetDirectionsFromCurrentLocation(business)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Cómo llegar
                        </button>
                        <button
                          onClick={() => handleGetDirections(business)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Ver en Maps
                        </button>
                      </div>
                      <a
                        href={`/businesses/${business.id}`}
                        className="text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver más detalles →
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {businessesWithCoords.length > 0 
              ? `${businessesWithCoords.length} negocios mostrados en el mapa`
              : 'No hay negocios con ubicación disponible para mostrar en el mapa'
            }
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .search-bar-container {
          animation: fadeIn 0.2s ease-out;
        }
        
        .search-bar-content {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .business-list-container {
          animation: fadeIn 0.5s ease-out 0.2s both;
        }
        
        .business-list-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .business-list-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .business-list-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .business-list-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
}

