'use client';

import { useState, useEffect } from 'react';
import { businessApi, categoryApi } from '../lib/api';
import { Business, Category } from '../types';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import SpecialOffers from '../components/SpecialOffers';
import FeaturedListings from '../components/FeaturedListings';
import FeaturesSection from '../components/FeaturesSection';
import CategorySection from '../components/CategorySection';
import DestinationCards from '../components/DestinationCards';
import AppDownload from '../components/AppDownload';
import StatsSection from '../components/StatsSection';
import VideoSection from '../components/VideoSection';
import NewsletterSection from '../components/NewsletterSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

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
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ limit: 12 }).catch(() => []),
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
          <HeroSection onSearch={handleSearch} />
          
          <SpecialOffers />
          
          <FeaturedListings businesses={businesses} loading={loading || searching} />
          
          <FeaturesSection />
          
          <CategorySection
            categories={categories}
            onCategorySelect={(categoryName) => handleSearch('', categoryName)}
          />
          
          <DestinationCards />
          
          <AppDownload />
          
          <StatsSection />
          
          <VideoSection />
          
          <NewsletterSection />
          
          <BlogSection />
        </main>

        <Footer />
      </div>
    </>
  );
}