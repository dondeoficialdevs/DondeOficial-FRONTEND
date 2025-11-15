'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { businessApi, categoryApi } from '../lib/api';
import { Business, Category } from '../types';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';
import ActionCards from '../components/ActionCards';
import FeaturedListings from '../components/FeaturedListings';
import FeaturesSection from '../components/FeaturesSection';
import CategorySection from '../components/CategorySection';
import AppDownload from '../components/AppDownload';
import StatsSection from '../components/StatsSection';
import VideoSection from '../components/VideoSection';
import NewsletterSection from '../components/NewsletterSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

// Importar componentes que requieren APIs del navegador solo en el cliente
const GoogleMapsSection = dynamic(() => import('../components/GoogleMapsSection'), { ssr: false });
const PWAInstaller = dynamic(() => import('../components/PWAInstaller'), { ssr: false });

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mostrar loading screen por 2 segundos
    const loadingTimer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2000);

    loadInitialData();

    return () => clearTimeout(loadingTimer);
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      console.log('🔍 Cargando datos iniciales...');
      console.log('📍 API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
      
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ limit: 12 }).catch((err) => {
          console.error('❌ Error loading businesses:', err);
          const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
          setError(`Error al cargar negocios: ${errorMsg}`);
          return [];
        }),
        categoryApi.getAll().catch((err) => {
          console.error('❌ Error loading categories:', err);
          return [];
        })
      ]);
      
      console.log('✅ Datos cargados:', {
        businesses: businessesData.length,
        categories: categoriesData.length
      });
      
      setBusinesses(businessesData);
      setCategories(categoriesData);
      
      // Si ambos arrays están vacíos, podría ser un error de conexión
      if (businessesData.length === 0 && categoriesData.length === 0) {
        setError('No se pudieron cargar los datos. Verifica la conexión con el servidor. Revisa la consola para más detalles.');
      } else if (businessesData.length === 0) {
        setError('No se encontraron negocios en la base de datos.');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los datos';
      setError(errorMessage);
      setBusinesses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (search: string, category?: string, location?: string) => {
    setSearching(true);
    try {
      const results = await businessApi.getAll({
        search,
        category,
        location,
        limit: 20
      });
      setBusinesses(results);
    } catch (error) {
      console.error('Error searching:', error);
      setBusinesses([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen />}
      
      <div className={`min-h-screen bg-white transition-opacity duration-500 ${
        showLoadingScreen ? 'opacity-0' : 'opacity-100'
      }`}>
        <Header />

        <main>
          <ActionCards />
          
          <GoogleMapsSection businesses={businesses} onSearch={handleSearch} />
          
          {error && (
            <div className="container mx-auto px-4 py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-medium">⚠️ {error}</p>
                <button
                  onClick={loadInitialData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}
          <FeaturedListings businesses={businesses} loading={loading || searching} />
          
          <FeaturesSection />
          
          <CategorySection
            categories={categories}
            onCategorySelect={(categoryName) => handleSearch('', categoryName)}
          />
          
          <AppDownload />
          
          <StatsSection />
          
          <VideoSection />
          
          <NewsletterSection />
          
          <BlogSection />
        </main>

        <Footer />

        <PWAInstaller />
      </div>
    </>
  );
}