'use client';

import { useEffect, useState } from 'react';
import { useServiceWorkerUpdate } from '@/hooks/useServiceWorkerUpdate';

export default function UpdateNotification() {
  const { updateAvailable, isUpdating, applyUpdate } = useServiceWorkerUpdate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowNotification(true);
    }
  }, [updateAvailable]);

  if (!showNotification || !updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right max-w-sm">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-blue-500 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Nueva versión disponible
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Hay una actualización disponible. ¿Deseas actualizar ahora?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  applyUpdate();
                  setShowNotification(false);
                }}
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Actualizando...' : 'Actualizar ahora'}
              </button>
              <button
                onClick={() => setShowNotification(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Más tarde
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

