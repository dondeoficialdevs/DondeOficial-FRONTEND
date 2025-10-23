'use client';

import { useState, useEffect } from 'react';
import { businessApi, categoryApi } from '../../lib/api';
import { Business, Category } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BusinessList from '../../components/BusinessList';
import SearchBar from '../../components/SearchBar';

export default function ListingsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ limit: 20 }).catch(() => []),
        categoryApi.getAll().catch(() => [])
      ]);
      setBusinesses(businessesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setBusinesses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

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
    handleSearch('', categoryName, location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Listings</h1>
          <p className="text-gray-600">Discover amazing businesses and services</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSearch('', '', location)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm || selectedCategory ? 'Search Results' : 'All Listings'}
            {businesses.length > 0 && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({businesses.length} found)
              </span>
            )}
          </h2>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => handleSearch('', '', '')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Business List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : businesses.length > 0 ? (
          <BusinessList businesses={businesses} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No listings found for your search criteria.
            </p>
            <button
              onClick={() => handleSearch('', '', '')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              View all listings
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
