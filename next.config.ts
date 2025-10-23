import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para producción
  output: 'standalone',
  
  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Optimizaciones para producción
  compress: true,
  poweredByHeader: false,
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },

  // Configuración de redirecciones
  async redirects() {
    return [
      // Redirecciones personalizadas si las necesitas
    ];
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;