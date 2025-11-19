'use client';

import { useState, useEffect } from 'react';

interface ImageSliderProps {
  images: Array<{ image_url: string; id?: number; is_primary?: boolean }>;
  alt: string;
  className?: string;
  maxImages?: number;
}

export default function ImageSlider({ images, alt, className = '', maxImages = 3 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Limitar a máximo 3 imágenes y ordenar por is_primary primero
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });
  const displayImages = sortedImages.slice(0, maxImages);
  
  if (!displayImages || displayImages.length === 0) {
    return (
      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Si solo hay una imagen, mostrar sin controles pero con el mismo estilo
  if (displayImages.length === 1) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <img
          src={displayImages[0].image_url}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden group ${className}`}>
      {/* Imágenes */}
      <div className="relative w-full h-full">
        {displayImages.map((image, index) => (
          <div
            key={image.id || index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.image_url}
              alt={`${alt} - Imagen ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación - Siempre visibles */}
      {displayImages.length > 1 && (
        <>
          {/* Botón anterior */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 active:bg-black/90 text-white p-2.5 rounded-full z-10 shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="Imagen anterior"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Botón siguiente */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 active:bg-black/90 text-white p-2.5 rounded-full z-10 shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="Imagen siguiente"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores de puntos - Siempre visibles */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? 'bg-white w-8 h-2.5 shadow-md'
                  : 'bg-white/70 hover:bg-white/90 w-2 h-2'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Contador de imágenes - Siempre visible */}
      {displayImages.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-md z-10 shadow-xl border border-white/20">
          {currentIndex + 1} / {displayImages.length}
        </div>
      )}
    </div>
  );
}

