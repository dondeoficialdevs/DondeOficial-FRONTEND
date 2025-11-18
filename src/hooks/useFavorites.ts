'use client';

import { useState, useEffect } from 'react';
import { Business } from '@/types';

const FAVORITES_KEY = 'dondeoficial_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar favoritos del localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, isLoading]);

  const addFavorite = (business: Business) => {
    setFavorites((prev) => {
      // Verificar si ya existe
      if (prev.some((fav) => fav.id === business.id)) {
        return prev;
      }
      return [...prev, business];
    });
  };

  const removeFavorite = (businessId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== businessId));
  };

  const toggleFavorite = (business: Business) => {
    const isFavorite = favorites.some((fav) => fav.id === business.id);
    if (isFavorite) {
      removeFavorite(business.id);
    } else {
      addFavorite(business);
    }
  };

  const isFavorite = (businessId: number): boolean => {
    return favorites.some((fav) => fav.id === businessId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}

