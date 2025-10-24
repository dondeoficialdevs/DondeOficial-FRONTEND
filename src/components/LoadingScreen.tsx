'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mostrar loading por 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Efecto de partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full opacity-30 animate-pulse particle-delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-25 animate-pulse particle-delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse particle-delay-1500"></div>
      </div>

      <div className="text-center text-white relative z-10">
        {/* Icono profesional de localización */}
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto bg-linear-to-br from-white to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <svg 
              className="w-14 h-14 text-blue-600" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          
          {/* Logo DONDEOFICIAL con gradiente */}
          <h1 className="text-6xl font-bold mb-4 tracking-wider bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            DONDEOFICIAL
          </h1>
          
          {/* Subtítulo elegante */}
          <p className="text-xl opacity-90 font-light tracking-wide">
            Encuentra negocios cerca de ti
          </p>
        </div>

        {/* Loading spinner profesional */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-10 w-10 border-2 border-blue-300 border-t-transparent opacity-50 spinner-reverse"></div>
          </div>
        </div>

        {/* Texto de carga */}
        <p className="text-sm opacity-75 mt-4 font-light tracking-wide">
          Cargando experiencia...
        </p>
      </div>
    </div>
  );
}
