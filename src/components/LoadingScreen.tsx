'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: '#161617' }}>
      {/* Efecto de partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#f1f1f1' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full opacity-30 animate-pulse particle-delay-500" style={{ backgroundColor: '#FF5A00' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse particle-delay-1000" style={{ backgroundColor: '#FF5A00' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 rounded-full opacity-20 animate-pulse particle-delay-1500" style={{ backgroundColor: '#f1f1f1' }}></div>
      </div>

      <div className="text-center relative z-10" style={{ color: '#f1f1f1' }}>
        {/* Logo del proyecto */}
        <div className="mb-8">
          <div className="flex justify-center mb-6 animate-pulse">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <Image
                src="/images/logo/Logo_Dondel.png"
                alt="DondeOficial Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                unoptimized={true}
              />
            </div>
          </div>
          
          {/* Subtítulo elegante */}
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 font-light tracking-wide px-4" style={{ color: '#f1f1f1' }}>
            Encuentra negocios cerca de ti
          </p>
        </div>

        {/* Loading spinner profesional */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent" style={{ borderColor: '#f1f1f1' }}></div>
            <div className="absolute inset-0 animate-spin rounded-full h-10 w-10 border-2 border-t-transparent opacity-50 spinner-reverse" style={{ borderColor: '#FF5A00' }}></div>
          </div>
        </div>

        {/* Texto de carga */}
        <p className="text-sm opacity-75 mt-4 font-light tracking-wide" style={{ color: '#f1f1f1' }}>
          Cargando experiencia...
        </p>
      </div>
    </div>
  );
}
