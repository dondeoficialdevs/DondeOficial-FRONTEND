'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Particle {
  size: number;
  left: number;
  top: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
  backgroundColor: string;
}

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Generar partículas solo en el cliente para evitar problemas de hidratación
    setIsMounted(true);
    const generatedParticles: Particle[] = [...Array(12)].map((_, i) => {
      const baseSize = 3;
      return {
        size: baseSize + Math.random() * 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
        animationDuration: 3 + Math.random() * 2,
        animationDelay: Math.random() * 2,
        backgroundColor: i % 3 === 0 ? '#FF5A00' : '#f1f1f1',
      };
    });
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
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

      {/* Efecto de ondas concéntricas mejoradas - Responsive */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3].map((i) => {
          // Usar unidades viewport para hacer las ondas responsive
          const baseSize = 30; // 30vw como base
          const sizeMultiplier = baseSize + (i * 10); // Incremento de 10vw por cada onda
          return (
            <div 
              key={i}
              className="absolute rounded-full border"
              style={{
                width: `min(${sizeMultiplier}vw, ${sizeMultiplier}vh)`,
                height: `min(${sizeMultiplier}vw, ${sizeMultiplier}vh)`,
                borderColor: '#FF5A00',
                opacity: 0.15 - (i * 0.03),
                animation: `pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.4}s`,
                boxShadow: `0 0 ${sizeMultiplier / 2}px rgba(255, 90, 0, 0.1)`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Partículas flotantes animadas - Responsive */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                backgroundColor: particle.backgroundColor,
                opacity: particle.opacity,
                animation: `float ${particle.animationDuration}s ease-in-out infinite`,
                animationDelay: `${particle.animationDelay}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Contenido principal - Responsive */}
      <div className="text-center relative z-10 animate-fade-in px-4 py-4 sm:py-8 md:py-12 lg:py-16 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        {/* Logo con efecto de entrada */}
        <div className="mb-4 sm:mb-6 md:mb-8 w-full">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div 
              className="relative animate-scale-in"
              style={{
                animation: 'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96">
                {/* Glow effect alrededor del logo */}
                <div 
                  className="absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-30 animate-pulse"
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
                  sizes="(max-width: 480px) 128px, (max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 256px, (max-width: 1280px) 320px, 384px"
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
          
          {/* Subtítulo con efecto de escritura */}
          <p 
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light tracking-wide px-2 sm:px-4 animate-slide-up"
            style={{ 
              color: '#f1f1f1',
              animation: 'slideUp 0.8s ease-out 0.3s both',
            }}
          >
            Encuentra negocios cerca de ti
          </p>
        </div>

        {/* Barra de progreso mejorada con diseño moderno - Responsive */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-4 sm:mb-6 md:mb-8">
          <div 
            className="h-1.5 sm:h-2 rounded-full overflow-hidden relative"
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
            className="text-xs sm:text-sm mt-1 sm:mt-2 font-medium"
            style={{ color: 'rgba(241, 241, 241, 0.6)' }}
          >
            {progress}%
          </p>
        </div>

        {/* Localizador animado - Diseño limpio */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
            {/* Glow suave alrededor */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-25"
              style={{
                background: 'radial-gradient(circle, #FF5A00 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            ></div>
            
            {/* SVG del localizador */}
            <svg 
              className="w-full h-full relative z-10"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff7a33" />
                  <stop offset="50%" stopColor="#FF5A00" />
                  <stop offset="100%" stopColor="#cc4800" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Círculo de carga - Spinner */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgba(255, 90, 0, 0.2)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#FF5A00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={Math.PI * 70}
                strokeDashoffset={Math.PI * 70 * (1 - progress / 100)}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50px 50px',
                  transition: 'stroke-dashoffset 0.1s linear',
                  filter: 'drop-shadow(0 0 4px rgba(255, 90, 0, 0.5))',
                }}
              />
              
              {/* Ondas de radar suaves */}
              <circle 
                cx="50" 
                cy="50" 
                r="20" 
                fill="none" 
                stroke="#FF5A00" 
                strokeWidth="1.5"
                opacity="0.3"
                style={{
                  animation: 'radarWave 2.5s ease-out infinite',
                }}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="20" 
                fill="none" 
                stroke="#FF5A00" 
                strokeWidth="1.5"
                opacity="0.3"
                style={{
                  animation: 'radarWave 2.5s ease-out infinite 0.6s',
                }}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="20" 
                fill="none" 
                stroke="#FF5A00" 
                strokeWidth="1.5"
                opacity="0.3"
                style={{
                  animation: 'radarWave 2.5s ease-out infinite 1.2s',
                }}
              />
              
              {/* Puntos de negocios alrededor */}
              <circle cx="30" cy="35" r="2" fill="#FF5A00" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0s" />
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="0s" />
              </circle>
              <circle cx="70" cy="40" r="2" fill="#FF5A00" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.4s" />
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="0.4s" />
              </circle>
              <circle cx="35" cy="70" r="2" fill="#FF5A00" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.8s" />
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="0.8s" />
              </circle>
              <circle cx="75" cy="65" r="2" fill="#FF5A00" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="1.2s" />
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="1.2s" />
              </circle>
              
              {/* Pin de localización - Centro */}
              <g transform="translate(50, 50)">
                {/* Sombra del pin */}
                <ellipse 
                  cx="0" 
                  cy="10" 
                  rx="5" 
                  ry="2.5" 
                  fill="#000" 
                  opacity="0.3"
                  style={{
                    animation: 'pinShadowPulse 2s ease-in-out infinite',
                  }}
                />
                
                {/* Cuerpo del pin */}
                <path 
                  d="M 0,-10 L -4.5,2 L 0,3.5 L 4.5,2 Z" 
                  fill="url(#pinGradient)"
                  stroke="#f1f1f1"
                  strokeWidth="0.6"
                  filter="url(#glow)"
                  style={{
                    animation: 'pinBounce 2s ease-in-out infinite',
                  }}
                />
                
                {/* Centro del pin con brillo */}
                <circle 
                  cx="0" 
                  cy="-4" 
                  r="2.5" 
                  fill="#f1f1f1"
                  style={{
                    animation: 'pinPulse 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 3px rgba(255, 90, 0, 0.8))',
                  }}
                />
                <circle 
                  cx="0" 
                  cy="-4" 
                  r="1.2" 
                  fill="#FF5A00"
                  style={{
                    animation: 'pinPulse 2s ease-in-out infinite',
                  }}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Texto de carga con efecto cubo 3D */}
        <div className="flex items-center justify-center gap-2 animate-fade-in-delay">
          <div className="flex gap-0.5 sm:gap-1" style={{ perspective: '1000px' }}>
            {'Cargando'.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block text-xs sm:text-sm font-semibold"
                style={{
                  color: '#f1f1f1',
                  transformStyle: 'preserve-3d',
                  animation: `cubeRotate 2s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
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

        @keyframes cubeRotate {
          0%, 100% {
            transform: rotateX(0deg) rotateY(0deg);
            opacity: 0.8;
          }
          25% {
            transform: rotateX(15deg) rotateY(-10deg);
            opacity: 1;
          }
          50% {
            transform: rotateX(0deg) rotateY(0deg);
            opacity: 0.8;
          }
          75% {
            transform: rotateX(-15deg) rotateY(10deg);
            opacity: 1;
          }
        }

        @keyframes radarWave {
          0% {
            r: 18;
            opacity: 0.5;
            stroke-width: 1.5;
          }
          100% {
            r: 45;
            opacity: 0;
            stroke-width: 0.5;
          }
        }

        @keyframes pinBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.05);
          }
        }

        @keyframes pinPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.15);
          }
        }

        @keyframes pinShadowPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1.2);
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
