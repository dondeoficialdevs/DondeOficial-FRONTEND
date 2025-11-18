'use client';

import { useEffect, useState } from 'react';

export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let refreshing = false;

    // Detectar cuando hay una actualización disponible
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // Registrar el service worker y escuchar actualizaciones
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        // Verificar actualizaciones periódicamente (cada 5 minutos)
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);

        // Escuchar cuando hay una nueva versión instalada
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Verificar si hay una actualización esperando
        registration.update();
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }, []);

  const applyUpdate = () => {
    if (!('serviceWorker' in navigator)) return;

    setIsUpdating(true);
    
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        // Decirle al service worker que se active
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Recargar la página
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
  };

  const clearCache = async () => {
    if (!('serviceWorker' in navigator) || !('caches' in window)) return;

    try {
      // Limpiar todos los caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Desregistrar todos los service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));

      // Recargar la página
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    updateAvailable,
    isUpdating,
    applyUpdate,
    clearCache,
  };
}

