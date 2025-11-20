'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { businessApi, categoryApi } from '../../lib/api';
import { Business, Category } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BusinessDetailModal from '../../components/BusinessDetailModal';
import ImageSlider from '../../components/ImageSlider';

export default function ListingsContent() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('most_sold');
  const [priceFilters, setPriceFilters] = useState<string[]>(['all']);
  const [ratingFilters, setRatingFilters] = useState<string[]>(['all']);
  const [sellerFilters, setSellerFilters] = useState<string[]>(['Todas']);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'featured'>('featured');
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllBusinesses, setShowAllBusinesses] = useState(false);

  // Cargar conteos de categorías de forma independiente y temprana
  const loadCategoryCounts = async () => {
    try {
      const countsData = await categoryApi.getCounts();
      const countsMap: Record<string, number> = {};
      countsData.forEach((item: { name: string; count: number }) => {
        countsMap[item.name.toUpperCase()] = item.count;
      });
      setCategoryCounts(countsMap);
    } catch (error) {
      console.error('Error loading category counts:', error);
      // En caso de error, mantener el objeto vacío
    } finally {
      setLoadingCounts(false);
    }
  };

  const loadInitialData = async (initialCategory?: string) => {
    try {
      const categoryToUse = initialCategory || selectedCategory;
      
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ 
          limit: 50,
          category: categoryToUse || undefined
        }).catch(() => []),
        categoryApi.getAll().catch(() => [])
      ]);
      
      setBusinesses(businessesData);
      setCategories(categoriesData);
      
      // Si hay una categoría inicial, actualizar el estado
      if (initialCategory) {
        setSelectedCategory(initialCategory);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar conteos de categorías inmediatamente al montar el componente
  useEffect(() => {
    loadCategoryCounts();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
      loadInitialData(decodedCategory);
    } else {
      loadInitialData();
    }
    // Resetear showAll cuando cambien los parámetros de búsqueda
    setShowAllBusinesses(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Resetear showAll cuando cambien los negocios o filtros
  useEffect(() => {
    setShowAllBusinesses(false);
  }, [businesses.length, priceFilters, ratingFilters, sellerFilters, sortBy]);

  const handleSearch = async (search: string, category?: string, loc?: string) => {
    setLoading(true);
    setSearchTerm(search);
    setSelectedCategory(category || '');
    setLocation(loc || '');
    
    try {
      const results = await businessApi.getAll({
        search,
        category,
        location: loc,
        limit: 50
      });
      setBusinesses(results);
    } catch (error) {
      console.error('Error searching:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleSearch('', categoryName, location);
  };

  const getCategoryCount = (categoryName: string) => {
    return businesses.filter(b => b.category_name?.toLowerCase() === categoryName.toLowerCase()).length;
  };

  const getCategoryIcon = (name: string) => {
    const iconStyle = {
      color: '#FF6B35',
      filter: 'drop-shadow(0 0 1px rgba(255, 107, 53, 0.4))',
    };
    
    const icons: { [key: string]: React.ReactElement } = {
      'Belleza': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Entretenimiento': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Gastronomía': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545zM12 6.253v12.5" />
        </svg>
      ),
      'Viajes y turismo': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Bienestar y salud': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'Servicios': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
        </svg>
      ),
      'Productos': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      'Cerca de mí': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[name] || (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  };

  const mainCategories = [
    'Belleza', 'Entretenimiento', 'Gastronomía', 'Viajes y turismo',
    'Bienestar y salud', 'Servicios', 'Productos', 'Cerca de mí'
  ];

  const getCategoryBackendName = (frontendName: string): string => {
    const foundCategory = categories.find(cat => 
      cat.name.toLowerCase() === frontendName.toLowerCase() ||
      cat.name.toLowerCase().includes(frontendName.toLowerCase()) ||
      frontendName.toLowerCase().includes(cat.name.toLowerCase())
    );
    
    if (foundCategory) {
      return foundCategory.name;
    }
    
    const categoryMap: { [key: string]: string } = {
      'Belleza': 'Belleza',
      'Entretenimiento': 'Entretenimiento',
      'Gastronomía': 'Gastronomía',
      'Viajes y turismo': 'Viajes y turismo',
      'Bienestar y salud': 'Bienestar y salud',
      'Servicios': 'Servicios',
      'Productos': 'Productos',
      'Cerca de mí': ''
    };
    return categoryMap[frontendName] || frontendName;
  };

  const togglePriceFilter = (value: string) => {
    if (value === 'all') {
      setPriceFilters(['all']);
    } else {
      setPriceFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(value)) {
          return newFilters.length > 1 ? newFilters.filter(f => f !== value) : ['all'];
        }
        return [...newFilters, value];
      });
    }
  };

  const toggleRatingFilter = (value: string) => {
    if (value === 'all') {
      setRatingFilters(['all']);
    } else {
      setRatingFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(value)) {
          return newFilters.length > 1 ? newFilters.filter(f => f !== value) : ['all'];
        }
        return [...newFilters, value];
      });
    }
  };

  const toggleSellerFilter = (value: string) => {
    if (value === 'Todas') {
      setSellerFilters(['Todas']);
    } else {
      setSellerFilters(prev => {
        const newFilters = prev.filter(f => f !== 'Todas');
        if (newFilters.includes(value)) {
          return newFilters.length > 1 ? newFilters.filter(f => f !== value) : ['Todas'];
        }
        return [...newFilters, value];
      });
    }
  };

  // Función para filtrar negocios según los filtros aplicados
  const getFilteredBusinesses = () => {
    let filtered = [...businesses];

    // Filtro por precio
    if (!priceFilters.includes('all') && priceFilters.length > 0) {
      filtered = filtered.filter(business => {
        // Usar el precio con oferta si existe, sino el precio normal
        const businessPrice = Number(business.offer_price) || Number(business.price) || 0;
        
        // Verificar si el precio del negocio está en alguno de los rangos seleccionados
        return priceFilters.some(priceFilter => {
          if (priceFilter === 'all') return true;
          
          if (priceFilter === '0-25000') {
            return businessPrice > 0 && businessPrice <= 25000;
          } else if (priceFilter === '25000-35000') {
            return businessPrice > 25000 && businessPrice <= 35000;
          } else if (priceFilter === '35000-55000') {
            return businessPrice > 35000 && businessPrice <= 55000;
          } else if (priceFilter === '55000+') {
            return businessPrice > 55000;
          }
          
          return false;
        });
      });
    }

    // Filtro por calificación
    if (!ratingFilters.includes('all') && ratingFilters.length > 0) {
      const minRating = Math.min(...ratingFilters.map(r => parseInt(r)));
      filtered = filtered.filter(business => {
        const rating = Number(business.average_rating) || 0;
        return rating >= minRating;
      });
    }

    // Filtro por vendedor (por ahora solo Marketplace, ya que eliminamos Cuponatic)
    if (!sellerFilters.includes('Todas') && sellerFilters.length > 0) {
      // Este filtro se puede implementar cuando se agregue información del vendedor
      // Por ahora, si está seleccionado "Marketplace", mostramos todos
      // Si no está seleccionado "Todas", no mostramos nada (lógica a ajustar según necesidades)
    }

    // Ordenamiento
    if (sortBy === 'rating') {
      filtered.sort((a, b) => {
        const ratingA = Number(a.average_rating) || 0;
        const ratingB = Number(b.average_rating) || 0;
        return ratingB - ratingA;
      });
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'price_low') {
      filtered.sort((a, b) => {
        const priceA = Number(a.offer_price) || Number(a.price) || 0;
        const priceB = Number(b.offer_price) || Number(b.price) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => {
        const priceA = Number(a.offer_price) || Number(a.price) || 0;
        const priceB = Number(b.offer_price) || Number(b.price) || 0;
        return priceB - priceA;
      });
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Categories Bar */}
        <div className="bg-white border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <div className="flex space-x-4 min-w-max">
              {mainCategories.map((cat) => {
                const backendCategoryName = getCategoryBackendName(cat);
                const isSelected = selectedCategory.toLowerCase() === backendCategoryName.toLowerCase();
                
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      if (cat === 'Cerca de mí') {
                        handleSearch('', '', '');
                        setSelectedCategory('');
                      } else {
                        handleCategoryFilter(backendCategoryName);
                      }
                    }}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all group ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'w-14 h-14 bg-white/20'
                        : 'w-14 h-14 bg-white shadow-md group-hover:shadow-lg group-hover:scale-110 border border-gray-100'
                    }`}>
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Sort Bar */}
          <div className="flex justify-end items-center pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Ordenar ofertas por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="most_sold">Más vendido</option>
                <option value="price_low">Precio: menor a mayor</option>
                <option value="price_high">Precio: mayor a menor</option>
                <option value="newest">Más recientes</option>
                <option value="rating">Mejor calificados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filtros</span>
        </button>

        <div className="flex gap-4">
          {/* Left Sidebar */}
          <aside className={`w-72 shrink-0 ${showMobileFilters ? 'block fixed inset-0 z-50 bg-white overflow-y-auto lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
            {showMobileFilters && (
              <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="bg-white lg:sticky lg:top-4">
              {/* Tabs */}
              <div className="bg-gray-100 flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex-1 px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'categories'
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  CATEGORIAS
                  {activeTab === 'categories' && (
                    <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`flex-1 px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'featured'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Destacados
                </button>
              </div>

              {/* Categories List */}
              <div className="p-0">
                {activeTab === 'featured' && (
                  <div className="space-y-0">
                    {[
                      { name: 'BELLEZA' },
                      { name: 'ENTRETENIMIENTO' },
                      { name: 'GASTRONOMÍA' },
                      { name: 'VIAJES Y TURISMO' },
                      { name: 'BIENESTAR Y SALUD' },
                      { name: 'SERVICIOS' },
                      { name: 'PRODUCTOS' },
                      { name: 'ESPECIALES' },
                    ].map((cat) => {
                      const count = loadingCounts ? (
                        <span className="inline-block w-8 h-4 bg-gray-200 animate-pulse rounded"></span>
                      ) : (
                        categoryCounts[cat.name] || 0
                      );
                      return (
                        <button
                          key={cat.name}
                          onClick={() => handleCategoryFilter(cat.name.toLowerCase())}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">
                              {typeof count === 'number' ? `(${count})` : count}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handleSearch('', '', '')}
                      className="w-full flex items-center justify-start px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">CERCA DE MÍ</span>
                    </button>
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="p-4 space-y-0.5">
                    {categories.map((category) => {
                      const count = loadingCounts ? (
                        <span className="inline-block w-8 h-4 bg-gray-200 animate-pulse rounded"></span>
                      ) : (
                        categoryCounts[category.name.toUpperCase()] || 0
                      );
                      const isActive = selectedCategory === category.name;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryFilter(category.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${
                            isActive
                              ? 'bg-orange-500 text-white font-bold'
                              : 'hover:bg-gray-100 text-gray-700 font-medium'
                          }`}
                        >
                          <span className="uppercase truncate flex-1 text-left pr-2">{category.name}</span>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className={isActive ? 'text-white' : 'text-gray-500'}>
                              {typeof count === 'number' ? `(${count})` : count}
                            </span>
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="p-4 space-y-4 border-t border-gray-200">
                {/* Localidades */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-2">Localidades</h4>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      handleSearch(searchTerm, selectedCategory, e.target.value);
                    }}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Precio */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-2">Precio</h4>
                  <div className="space-y-1.5">
                    {[
                      { value: 'all', label: 'Todas' },
                      { value: '0-25000', label: 'Hasta $25.000' },
                      { value: '25000-35000', label: '$25.000 a $35.000' },
                      { value: '35000-55000', label: '$35.000 a $55.000' },
                      { value: '55000+', label: 'Más de $55.000' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={priceFilters.includes(price.value)}
                          onChange={() => togglePriceFilter(price.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Calificación */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-2">Calificación</h4>
                  <div className="space-y-1.5">
                    {[
                      { value: 'all', label: 'Todas' },
                      { value: '5', label: '5' },
                      { value: '4', label: '4' },
                      { value: '3', label: '3' },
                      { value: '2', label: '2' },
                      { value: '1', label: '1' }
                    ].map((rating) => (
                      <label key={rating.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ratingFilters.includes(rating.value)}
                          onChange={() => toggleRatingFilter(rating.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {rating.value === 'all' ? rating.label : `${rating.label} estrellas y más`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Vendido por */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-2">Vendido por</h4>
                  <div className="space-y-1.5">
                    {['Todas', 'Marketplace'].map((seller) => (
                      <label key={seller} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sellerFilters.includes(seller)}
                          onChange={() => toggleSellerFilter(seller)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{seller}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando...</p>
              </div>
            ) : (() => {
              const filteredBusinesses = getFilteredBusinesses();
              const initialDisplayCount = 9;
              const displayedBusinesses = showAllBusinesses 
                ? filteredBusinesses 
                : filteredBusinesses.slice(0, initialDisplayCount);
              const hasMore = filteredBusinesses.length > initialDisplayCount;
              
              return displayedBusinesses.length > 0 ? (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedBusinesses.map((business) => {
                  const primaryImage = business.images?.find(img => img.is_primary) || business.images?.[0];
                  // Usar precio real del negocio
                  // Convertir has_offer correctamente (puede venir como string 'true', boolean true, etc.)
                  const hasOffer = business.has_offer === true || 
                                  business.has_offer === 'true' || 
                                  business.has_offer === 't' || 
                                  business.has_offer === 1 || 
                                  false;
                  const currentPrice = Number(business.offer_price) || Number(business.price) || 0;
                  const originalPrice = hasOffer && business.offer_price ? Number(business.price) : 0;
                  const distance = (Math.random() * 200 + 10).toFixed(1);
                  
                  // Debug: Mostrar en consola si tiene oferta (solo para desarrollo)
                  // console.log('Business:', business.name, 'has_offer:', business.has_offer, 'hasOffer:', hasOffer);

                  return (
                    <div key={business.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Slider de imágenes (máximo 3) */}
                      <div className="relative h-48">
                        {business.images && business.images.length > 0 ? (
                          <>
                            <ImageSlider
                              images={business.images}
                              alt={business.name}
                              maxImages={3}
                              className="w-full h-full"
                            />
                            {/* Badge de Ofertas */}
                            {hasOffer && (
                              <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md text-xs font-bold text-white z-20 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg flex items-center space-x-1.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.179 4.455a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.179-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                </svg>
                                <span>OFERTA</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {/* Badge de Ofertas para negocio sin imagen */}
                            {hasOffer && (
                              <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md text-xs font-bold text-white z-20 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg flex items-center space-x-1.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.179 4.455a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.179-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                </svg>
                                <span>OFERTA</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                          {business.name}
                        </h3>

                        {/* Location */}
                        {business.address && (
                          <div className="flex items-center text-xs text-gray-600 mb-2">
                            <span className="font-medium">{distance} km, {business.address}</span>
                          </div>
                        )}

                        {/* Services Icons */}
                        <div className="flex items-center space-x-3 mb-3">
                          {business.opening_hours && (
                            <div className="flex items-center text-xs text-gray-600">
                              <span className="font-medium">Alojamiento incluido</span>
                            </div>
                          )}
                          {business.phone && (
                            <div className="flex items-center text-xs text-gray-600">
                              <span className="font-medium">Desayuno incluido</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        {currentPrice > 0 && (
                          <div className="flex items-baseline space-x-2 mb-2">
                            <span className="text-xl font-bold text-gray-900">
                              ${currentPrice.toLocaleString('es-CO')}
                            </span>
                            {hasOffer && originalPrice > 0 && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  ${originalPrice.toLocaleString('es-CO')}
                                </span>
                                <span className="text-xs font-bold text-red-500">
                                  -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Offer Description */}
                        {hasOffer && business.offer_description && (
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                              {business.offer_description}
                            </span>
                          </div>
                        )}

                        {/* Sold Count */}
                        {business.total_reviews !== undefined && business.total_reviews > 0 && (
                          <div className="mb-3">
                            <span className="text-xs text-gray-600 font-medium">
                              {business.total_reviews} {business.total_reviews === 1 ? 'Reseña' : 'Reseñas'}
                            </span>
                          </div>
                        )}

                        {/* Button */}
                        <button
                          onClick={() => {
                            setSelectedBusinessId(business.id);
                            setIsModalOpen(true);
                          }}
                          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          VER OFERTA
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAllBusinesses(!showAllBusinesses)}
                    className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span>{showAllBusinesses ? 'Ver Menos' : 'Ver Más'}</span>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${showAllBusinesses ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No se encontraron negocios con los filtros seleccionados</p>
              </div>
            );
            })()}
          </div>
        </div>
      </main>

      <Footer />

      {/* Business Detail Modal */}
      <BusinessDetailModal
        businessId={selectedBusinessId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBusinessId(null);
        }}
      />
    </div>
  );
}

