'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Mostrar loading por 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #161617 0%, #1a1a1b 50%, #161617 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite',
      }}
    >
      {/* Efecto de gradiente animado de fondo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 50%, #FF5A00 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255, 90, 0, 0.3) 0%, transparent 50%)',
          animation: 'gradientMove 10s ease infinite',
        }}
      ></div>

      {/* Efecto de ondas concéntricas mejoradas */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[200, 300, 400, 500].map((size, i) => (
          <div 
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderColor: '#FF5A00',
              opacity: 0.15 - (i * 0.03),
              animation: `pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.4}s`,
              boxShadow: `0 0 ${size / 2}px rgba(255, 90, 0, 0.1)`,
            }}
          ></div>
        ))}
      </div>

      {/* Partículas flotantes animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#FF5A00' : '#f1f1f1',
              opacity: Math.random() * 0.5 + 0.2,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="text-center relative z-10 animate-fade-in">
        {/* Logo con efecto de entrada */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div 
              className="relative animate-scale-in"
              style={{
                animation: 'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Glow effect alrededor del logo */}
                <div 
                  className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, #FF5A00 0%, transparent 70%)',
                    transform: 'scale(1.2)',
                  }}
                ></div>
                <Image
                  src="/images/logo/Logo_Dondel.png"
                  alt="DondeOficial Logo"
                  fill
                  className="object-contain drop-shadow-2xl relative z-10"
                  priority
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
          
          {/* Subtítulo con efecto de escritura */}
          <p 
            className="text-lg sm:text-xl md:text-2xl font-light tracking-wide px-4 animate-slide-up"
            style={{ 
              color: '#f1f1f1',
              animation: 'slideUp 0.8s ease-out 0.3s both',
            }}
          >
            Encuentra negocios cerca de ti
          </p>
        </div>

        {/* Barra de progreso mejorada con diseño moderno */}
        <div className="w-64 sm:w-80 md:w-96 mx-auto mb-8">
          <div 
            className="h-2 rounded-full overflow-hidden relative"
            style={{ 
              backgroundColor: 'rgba(241, 241, 241, 0.08)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FF5A00 0%, #ff7a33 30%, #ff9d66 50%, #ff7a33 70%, #FF5A00 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
                boxShadow: '0 0 10px rgba(255, 90, 0, 0.5), 0 0 20px rgba(255, 90, 0, 0.3)',
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 1.5s linear infinite',
                }}
              ></div>
              {/* Efecto de brillo superior */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent)',
                }}
              ></div>
            </div>
          </div>
          {/* Porcentaje de carga */}
          <p 
            className="text-xs mt-2 font-medium"
            style={{ color: 'rgba(241, 241, 241, 0.6)' }}
          >
            {progress}%
          </p>
        </div>

        {/* Spinner mejorado con efectos 3D */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            {/* Glow alrededor del spinner */}
            <div 
              className="absolute inset-0 rounded-full blur-md opacity-30"
              style={{
                background: 'radial-gradient(circle, #FF5A00 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            ></div>
            {/* Anillo exterior con gradiente */}
            <div 
              className="absolute inset-0 rounded-full border-t-transparent animate-spin"
              style={{ 
                border: '3px solid',
                borderImage: 'linear-gradient(45deg, #f1f1f1, #FF5A00, #f1f1f1) 1',
                borderColor: '#f1f1f1',
                animationDuration: '1s',
                filter: 'drop-shadow(0 0 8px rgba(255, 90, 0, 0.4))',
              }}
            ></div>
            {/* Anillo medio con efecto de brillo */}
            <div 
              className="absolute inset-2 rounded-full border-2 border-b-transparent animate-spin"
              style={{ 
                borderColor: '#FF5A00',
                animationDuration: '1.5s',
                animationDirection: 'reverse',
                boxShadow: '0 0 10px rgba(255, 90, 0, 0.5)',
              }}
            ></div>
            {/* Anillo interior */}
            <div 
              className="absolute inset-4 rounded-full border-2 border-r-transparent animate-spin"
              style={{ 
                borderColor: '#f1f1f1',
                animationDuration: '0.8s',
                opacity: 0.7,
              }}
            ></div>
            {/* Centro con punto brillante */}
            <div 
              className="absolute inset-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, #FF5A00 0%, transparent 70%)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            ></div>
          </div>
        </div>

        {/* Texto de carga con efecto mejorado */}
        <div className="flex items-center justify-center gap-2 animate-fade-in-delay">
          <p 
            className="text-sm font-light tracking-wide"
            style={{ 
              color: '#f1f1f1',
              opacity: 0.8,
            }}
          >
            Cargando
          </p>
          <div className="flex gap-1">
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: '#FF5A00',
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '0s',
              }}
            ></div>
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: '#FF5A00',
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '0.2s',
              }}
            ></div>
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: '#FF5A00',
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '0.4s',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Estilos CSS inline para animaciones */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0) translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2) translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradientMove {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}
