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
  const [customLocation, setCustomLocation] = useState('');
  const [isUsingCustomLocation, setIsUsingCustomLocation] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Lista de ciudades comunes de Colombia
  const colombianCities = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Soledad',
    'Ibagué', 'Bucaramanga', 'Santa Marta', 'Villavicencio', 'Pereira', 'Valledupar',
    'Manizales', 'Buenaventura', 'Pasto', 'Neiva', 'Armenia', 'Sincelejo', 'Montería',
    'Popayán', 'Riohacha', 'Tunja', 'Quibdó', 'Florencia', 'Yopal', 'Mocoa', 'Leticia'
  ];

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

  // Cerrar sugerencias cuando se cambia de modo
  useEffect(() => {
    if (!isUsingCustomLocation) {
      setShowCitySuggestions(false);
      setCitySuggestions([]);
    }
  }, [isUsingCustomLocation]);

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
    setCustomLocation('');
    setIsUsingCustomLocation(false);
    // Si hay ubicación del usuario guardada, restaurar el centro del mapa
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(13);
    } else {
      // Si no hay ubicación, volver al centro basado en negocios
      const newCenter = calculateCenter(businessesWithCoords);
      setMapCenter(newCenter);
      setMapZoom(12);
    }
    // Limpiar búsqueda de ubicación
    onSearch(searchTerm || '', selectedCategory || undefined, '');
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomLocation(value);
    if (value.trim()) {
      setIsUsingCustomLocation(true);
      setLocation(value);
      
      // Filtrar ciudades que coincidan con lo escrito
      const filtered = colombianCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(filtered.length > 0 && value.length > 0);
      
      // Buscar con la ciudad personalizada solo si no hay sugerencias o si es una ciudad exacta
      if (filtered.length === 0 || colombianCities.includes(value)) {
        onSearch(searchTerm || '', selectedCategory || undefined, value);
      }
    } else {
      setIsUsingCustomLocation(false);
      setLocation('Cerca de mí');
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCitySuggestionClick = (city: string) => {
    setCustomLocation(city);
    setLocation(city);
    setIsUsingCustomLocation(true);
    setShowCitySuggestions(false);
    setCitySuggestions([]);
    // Buscar con la ciudad seleccionada
    onSearch(searchTerm || '', selectedCategory || undefined, city);
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      setIsUsingCustomLocation(true);
      setLocation(customLocation);
      onSearch(searchTerm || '', selectedCategory || undefined, customLocation);
    }
  };

  const handleNearMeClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const newUserLocation: [number, number] = [userLat, userLng];
          setUserLocation(newUserLocation);
          setMapCenter(newUserLocation);
          setMapZoom(13);
          setLocation('Cerca de mí');
          setCustomLocation('');
          setIsUsingCustomLocation(false);
          setLocationError(null);
          // Buscar negocios cercanos usando la ubicación como coordenadas
          onSearch(searchTerm || '', selectedCategory || undefined, `${userLat},${userLng}`);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setLocationError('No se pudo obtener tu ubicación. Verifica los permisos de geolocalización.');
          alert('No se pudo obtener tu ubicación. Por favor, verifica que hayas permitido el acceso a tu ubicación.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Tu navegador no soporta geolocalización');
      alert('Tu navegador no soporta geolocalización.');
    }
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
            <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-[1000] search-bar-container">
              <div className="bg-blue-900 md:bg-blue-800 rounded-lg md:rounded-xl p-2 sm:p-4 md:p-5 shadow-2xl">
                {/* Primera fila: Categorías, Búsqueda, Menú y Cerrar */}
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0 md:gap-3 md:flex-nowrap">
                  {/* Botón Categorías */}
                  <div className="relative category-dropdown flex-shrink-0">
                    <button
                      onClick={() => {
                        setShowCategoryDropdown(!showCategoryDropdown);
                        setShowMenuDropdown(false);
                      }}
                      className="flex items-center gap-1 sm:gap-2 md:gap-2.5 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gray-200 md:bg-gray-100 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-300 md:hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm md:text-base shadow-sm md:shadow"
                    >
                      <span className="font-semibold hidden sm:inline">Categorías</span>
                      <span className="font-semibold sm:hidden">Cat.</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-y-auto">
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-xs sm:text-sm font-medium text-gray-900"
                            >
                              {category.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500">Cargando categorías...</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Campo de búsqueda con ubicación integrada en desktop */}
                  <form id="search-form" onSubmit={handleSearchSubmit} className="flex-1 min-w-[120px] flex items-center gap-1 sm:gap-2 md:gap-0 md:bg-gray-100 md:rounded-xl md:shadow">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="¿Qué buscas?"
                      className="flex-1 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gray-200 md:bg-transparent rounded-lg md:rounded-l-xl md:rounded-r-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:focus:ring-blue-600 font-medium text-xs sm:text-sm md:text-base"
                    />
                    
                    {/* Ubicación "Cerca de mí" o ciudad personalizada integrada en desktop */}
                    <div className="hidden md:flex items-center gap-0 border-l border-gray-300">
                      {!isUsingCustomLocation ? (
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <button
                            type="button"
                            onClick={handleNearMeClick}
                            className="flex items-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer rounded px-2 py-1"
                            aria-label="Buscar cerca de mí"
                          >
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm text-gray-900 font-semibold whitespace-nowrap">{location}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUsingCustomLocation(true);
                              setCustomLocation('');
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            title="Escribir otra ciudad"
                          >
                            Cambiar
                          </button>
                        </div>
                      ) : (
                        <div className="relative flex-1">
                          <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-2 px-3 py-2.5">
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                              type="text"
                              value={customLocation}
                              onChange={handleCustomLocationChange}
                              onFocus={() => {
                                if (citySuggestions.length > 0 && customLocation.length > 0) {
                                  setShowCitySuggestions(true);
                                }
                              }}
                              placeholder="Escribe una ciudad..."
                              className="text-sm text-gray-900 font-semibold bg-transparent border-none outline-none focus:outline-none flex-1 min-w-[120px] placeholder-gray-400"
                              autoFocus
                              onBlur={() => {
                                // Delay para permitir el click en las sugerencias
                                setTimeout(() => {
                                  setShowCitySuggestions(false);
                                  if (!customLocation.trim()) {
                                    setIsUsingCustomLocation(false);
                                    setLocation('Cerca de mí');
                                  }
                                }, 200);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsUsingCustomLocation(false);
                                setCustomLocation('');
                                setLocation('Cerca de mí');
                                setShowCitySuggestions(false);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                              title="Usar mi ubicación"
                            >
                              Mi ubicación
                            </button>
                          </form>
                          {/* Sugerencias de ciudades */}
                          {showCitySuggestions && citySuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-48 overflow-y-auto">
                              {citySuggestions.map((city, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleCitySuggestionClick(city)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-900"
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleClearLocation}
                        className="text-gray-600 hover:text-gray-900 flex-shrink-0 px-2"
                        aria-label="Limpiar ubicación"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </form>

                  {/* Botón para cerrar el buscador */}
                  <button
                    onClick={() => {
                      setShowSearchBar(false);
                      setSearchTerm('');
                      setSelectedCategory('');
                      setLocation('Cerca de mí');
                    }}
                    className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-red-600 md:bg-red-500 text-white rounded-lg md:rounded-xl hover:bg-red-700 md:hover:bg-red-600 transition-colors flex-shrink-0 shadow-sm md:shadow"
                    title="Cerrar buscador"
                    aria-label="Cerrar buscador"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Botón con menú desplegable */}
                  <div className="relative menu-dropdown flex-shrink-0">
                    <button
                      onClick={() => {
                        setShowMenuDropdown(!showMenuDropdown);
                        setShowCategoryDropdown(false);
                      }}
                      className="px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-teal-600 md:bg-teal-500 text-white rounded-lg md:rounded-xl hover:bg-teal-700 md:hover:bg-teal-600 transition-colors font-medium text-xs sm:text-sm md:text-base shadow-sm md:shadow"
                      aria-label="Menú"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    
                    {showMenuDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-teal-600 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          <Link href="/add-listing" className="block px-3 sm:px-4 py-2 text-white hover:bg-teal-700 transition-colors font-semibold text-xs sm:text-sm" onClick={() => setShowMenuDropdown(false)}>
                            ANUNCIA TU NEGOCIO
                          </Link>
                          <div className="border-t border-teal-500 my-1"></div>
                          <Link href="/admin/login" className="block px-3 sm:px-4 py-2 text-white hover:bg-teal-700 transition-colors font-medium text-xs sm:text-sm" onClick={() => setShowMenuDropdown(false)}>
                            INICIAR SESIÓN
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón de búsqueda (lupa) - al final */}
                  <button
                    type="button"
                    onClick={() => {
                      const locationToUse = location === 'Cerca de mí' ? '' : location;
                      onSearch(searchTerm, selectedCategory || undefined, locationToUse);
                    }}
                    className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-blue-800 md:bg-blue-700 text-white rounded-lg md:rounded-xl hover:bg-blue-700 md:hover:bg-blue-600 transition-colors flex-shrink-0 shadow-sm md:shadow"
                    aria-label="Buscar"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Segunda fila: Filtro de ubicación (solo en móvil) */}
                <div className="flex md:hidden items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2.5 bg-white rounded-lg mt-2 w-full">
                  {!isUsingCustomLocation ? (
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        type="button"
                        onClick={handleNearMeClick}
                        className="flex items-center gap-2 flex-1 hover:bg-gray-50 transition-colors rounded px-2 py-1"
                        aria-label="Buscar cerca de mí"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-900 font-semibold truncate flex-1 text-left">{location}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUsingCustomLocation(true);
                          setCustomLocation('');
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                        title="Escribir otra ciudad"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div className="relative flex-1">
                      <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="text"
                          value={customLocation}
                          onChange={handleCustomLocationChange}
                          onFocus={() => {
                            if (citySuggestions.length > 0 && customLocation.length > 0) {
                              setShowCitySuggestions(true);
                            }
                          }}
                          placeholder="Escribe una ciudad..."
                          className="text-xs sm:text-sm text-gray-900 font-semibold bg-transparent border-none outline-none focus:outline-none flex-1 placeholder-gray-400"
                          autoFocus
                          onBlur={() => {
                            // Delay para permitir el click en las sugerencias
                            setTimeout(() => {
                              setShowCitySuggestions(false);
                              if (!customLocation.trim()) {
                                setIsUsingCustomLocation(false);
                                setLocation('Cerca de mí');
                              }
                            }, 200);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsUsingCustomLocation(false);
                            setCustomLocation('');
                            setLocation('Cerca de mí');
                            setShowCitySuggestions(false);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                          title="Usar mi ubicación"
                        >
                          Mi ubicación
                        </button>
                      </form>
                      {/* Sugerencias de ciudades - móvil */}
                      {showCitySuggestions && citySuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-48 overflow-y-auto">
                          {citySuggestions.map((city, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleCitySuggestionClick(city)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-xs sm:text-sm font-medium text-gray-900"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="text-gray-600 hover:text-gray-900 flex-shrink-0"
                    aria-label="Limpiar ubicación"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Lista de negocios encontrados */}
              {(searchTerm || selectedCategory) && filteredBusinesses.length > 0 && (
                <div className="mt-2 sm:mt-4 bg-white rounded-lg shadow-lg max-h-64 sm:max-h-96 overflow-y-auto">
                  <div className="p-2 sm:p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
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
                        className="p-2 sm:p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-1">{business.name}</h4>
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
                <div className="mt-2 sm:mt-4 bg-white rounded-lg shadow-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    No se encontraron negocios con los criterios de búsqueda
                  </p>
                </div>
              )}
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
                <Popup className="custom-popup" maxWidth={400}>
                  <div className="p-4 min-w-[320px] max-w-[400px]">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">
                      {business.name}
                    </h3>
                    
                    {business.category_name && (
                      <div className="mb-3">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {business.category_name}
                        </span>
                      </div>
                    )}

                    {business.description && (
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        {business.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 border-t border-gray-200 pt-3">
                      {business.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="flex-1">{business.address}</span>
                        </div>
                      )}
                      
                      {business.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium">{business.phone}</span>
                        </div>
                      )}

                      {business.opening_hours && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{business.opening_hours}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGetDirectionsFromCurrentLocation(business)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Cómo llegar
                        </button>
                        <button
                          onClick={() => handleGetDirections(business)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Ver en Maps
                        </button>
                      </div>
                      <a
                        href={`/businesses/${business.id}`}
                        className="block text-center px-4 py-2.5 bg-gray-100 text-blue-600 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors"
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
        
        /* Estilos personalizados para popup del mapa */
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
          max-width: 400px !important;
          min-width: 320px !important;
        }
        
        :global(.leaflet-popup-content) {
          margin: 0 !important;
          width: 100% !important;
          min-width: 320px !important;
        }
        
        :global(.custom-popup) {
          max-width: 400px !important;
          min-width: 320px !important;
        }
        
        :global(.leaflet-popup-tip) {
          background: white !important;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </section>
  );
}

