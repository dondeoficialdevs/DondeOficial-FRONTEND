'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Business } from '../types';
import SearchBar from './SearchBar';

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

  // Filtrar negocios que tienen coordenadas
  const businessesWithCoords = useMemo(() => {
    return businesses.filter(
      (business) => business.latitude && business.longitude
    );
  }, [businesses]);

  // Calcular centro inicial
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    if (businessesWithCoords.length === 0) return defaultCenter;
    const avgLat = businessesWithCoords.reduce((sum, b) => sum + (b.latitude || 0), 0) / businessesWithCoords.length;
    const avgLng = businessesWithCoords.reduce((sum, b) => sum + (b.longitude || 0), 0) / businessesWithCoords.length;
    return [avgLat, avgLng];
  });

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
          if (businessesWithCoords.length > 0) {
            const avgLat = businessesWithCoords.reduce((sum, b) => sum + (b.latitude || 0), 0) / businessesWithCoords.length;
            const avgLng = businessesWithCoords.reduce((sum, b) => sum + (b.longitude || 0), 0) / businessesWithCoords.length;
            setMapCenter([avgLat, avgLng]);
          }
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

  // Actualizar centro cuando cambien los negocios (solo si no hay ubicación del usuario)
  useEffect(() => {
    if (!userLocation && businessesWithCoords.length > 0) {
      const avgLat = businessesWithCoords.reduce((sum, b) => sum + (b.latitude || 0), 0) / businessesWithCoords.length;
      const avgLng = businessesWithCoords.reduce((sum, b) => sum + (b.longitude || 0), 0) / businessesWithCoords.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [businessesWithCoords.length, userLocation]);

  const handleMarkerClick = (business: Business) => {
    setSelectedBusiness(business);
    setShowSearchBar(false);
    if (business.latitude && business.longitude) {
      setMapCenter([business.latitude, business.longitude]);
      setMapZoom(15);
    }
  };

  const handleSearch = (search: string, category?: string, location?: string) => {
    onSearch(search, category, location);
    setShowSearchBar(false);
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
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explora Negocios en el Mapa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Haz clic en el mapa para buscar negocios o explora los marcadores para ver más detalles
          </p>
        </div>

        {/* SearchBar que aparece al hacer click */}
        {showSearchBar && (
          <div className="mb-6 search-bar-container">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 search-bar-content">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Buscar Negocios</h3>
                    <p className="text-sm text-gray-500">Encuentra lo que necesitas cerca de ti</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSearchBar(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300 group"
                  aria-label="Cerrar búsqueda"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {/* Lista de negocios registrados */}
            {businessesWithCoords.length > 0 && (
              <div className="mt-6 business-list-container">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">
                      Negocios en el Mapa ({businessesWithCoords.length})
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                    {businessesWithCoords.map((business) => (
                      <div
                        key={business.id}
                        onClick={() => handleMarkerClick(business)}
                        className="group bg-gray-50 rounded-xl p-4 border-2 border-transparent hover:border-blue-300 hover:bg-white cursor-pointer transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icono de ubicación */}
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          
                          {/* Información del negocio */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {business.name}
                            </h5>
                            {business.category_name && (
                              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2">
                                {business.category_name}
                              </span>
                            )}
                            {business.address && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                📍 {business.address}
                              </p>
                            )}
                            {business.phone && (
                              <p className="text-xs text-gray-500 mt-1">
                                📞 {business.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mapa */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200" style={{ height: '500px' }}>
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
            {businessesWithCoords.map((business) => (
              <Marker
                key={business.id}
                position={[business.latitude!, business.longitude!]}
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

