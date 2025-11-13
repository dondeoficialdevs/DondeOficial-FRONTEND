'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { businessApi, categoryApi } from '@/lib/api';
import { Business, Category } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessList from '@/components/BusinessList';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.name as string;
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadData();
  }, [categoryName]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ category: categoryName, limit: 50 }).catch(() => []),
        categoryApi.getAll().catch(() => [])
      ]);
      
      setBusinesses(businessesData);
      setCategories(categoriesData);
      
      const category = categoriesData.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      setCurrentCategory(category || null);
    } catch (error) {
      console.error('Error loading data:', error);
      setBusinesses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplayName = (name: string) => {
    const nameMap: { [key: string]: string } = {
      'restaurant': 'Restaurantes',
      'museum': 'Museos',
      'gym': 'Gimnasios',
      'shopping': 'Compras',
      'fitness zone': 'Zona Fitness',
      'party center': 'Centros de Fiestas',
      'game field': 'Campos de Juego',
      'job & feed': 'Trabajo y Servicios'
    };
    return nameMap[name.toLowerCase()] || name;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-blue-600 transition-colors">
              Directorio
            </Link>
            <span>/</span>
            <span className="text-gray-900">{getCategoryDisplayName(categoryName)}</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {getCategoryDisplayName(categoryName)}
          </h1>
          {currentCategory?.description && (
            <p className="text-gray-600 text-lg">{currentCategory.description}</p>
          )}
        </div>

        <BusinessList businesses={businesses} loading={loading} />
        
        {!loading && businesses.length === 0 && (
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
            <p className="text-gray-500 text-lg mb-4">
              No hay negocios en esta categoría aún
            </p>
            <Link
              href="/add-listing"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Agregar Negocio
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

