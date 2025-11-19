'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { businessApi, categoryApi } from '../../lib/api';
import { Business, Category } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BusinessDetailModal from '../../components/BusinessDetailModal';

export default function ListingsContent() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('most_sold');
  const [priceFilters, setPriceFilters] = useState<string[]>(['all']);
  const [ratingFilters, setRatingFilters] = useState<string[]>(['all']);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'featured'>('featured');
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
      loadInitialData(decodedCategory);
    } else {
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
    const icons: { [key: string]: React.ReactElement } = {
      'Belleza': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Entretenimiento': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Gastronomía': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545zM12 6.253v12.5" />
        </svg>
      ),
      'Viajes y turismo': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Bienestar y salud': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'Servicios': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
        </svg>
      ),
      'Productos': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      'Cerca de mí': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[name] || (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-white/20'
                        : 'bg-gray-100'
                    }`}>
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">{cat}</span>
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
                      { name: 'BELLEZA', count: 718 },
                      { name: 'ENTRETENIMIENTO', count: 220 },
                      { name: 'GASTRONOMÍA', count: 146 },
                      { name: 'VIAJES Y TURISMO', count: 279 },
                      { name: 'BIENESTAR Y SALUD', count: 507 },
                      { name: 'SERVICIOS', count: 269 },
                      { name: 'PRODUCTOS', count: 205 },
                      { name: 'ESPECIALES', count: 485 },
                    ].map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategoryFilter(cat.name.toLowerCase())}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">({cat.count})</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
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
                      const count = getCategoryCount(category.name);
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
                          <span className="uppercase">{category.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={isActive ? 'text-white' : 'text-gray-500'}>
                              ({count})
                            </span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    {['Todas', 'Cuponatic', 'Marketplace'].map((seller) => (
                      <label key={seller} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={seller === 'Todas'}
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
            ) : businesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {businesses.map((business) => {
                  const primaryImage = business.images?.find(img => img.is_primary) || business.images?.[0];
                  const hasDiscount = Math.random() > 0.5;
                  const discountPercent = hasDiscount ? Math.floor(Math.random() * 40) + 20 : 0;
                  const originalPrice = hasDiscount ? Math.floor(Math.random() * 300000) + 200000 : 0;
                  const currentPrice = hasDiscount ? Math.floor(originalPrice * (1 - discountPercent / 100)) : Math.floor(Math.random() * 200000) + 50000);
                  const soldCount = Math.floor(Math.random() * 50) + 10;
                  const showBanner = Math.random() > 0.7;
                  const bannerText = showBanner ? (Math.random() > 0.5 ? 'TENDENCIAS DE NOVIEMBRE' : 'DESTINOS TOP') : '';
                  const distance = (Math.random() * 200 + 10).toFixed(1);

                  return (
                    <div key={business.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage.image_url}
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Banner */}
                        {showBanner && (
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white ${
                            bannerText === 'TENDENCIAS DE NOVIEMBRE' ? 'bg-orange-500' : 'bg-blue-600'
                          }`}>
                            {bannerText}
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
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            ${currentPrice.toLocaleString('es-CO')}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                              ${originalPrice.toLocaleString('es-CO')}
                            </span>
                          )}
                        </div>

                        {/* Sold Count */}
                        <div className="mb-3">
                          <span className="text-xs text-gray-600 font-medium">
                            {soldCount} Vendidos
                          </span>
                        </div>

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
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No se encontraron negocios</p>
              </div>
            )}
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

