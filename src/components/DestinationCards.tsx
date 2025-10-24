'use client';

import { useEffect, useState } from 'react';

export default function DestinationCards() {
  const [isVisible, setIsVisible] = useState(false);
  
  const destinations = [
    { 
      name: 'Australia', 
      listings: 10, 
      image: '/images/destinations/australia.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-blue-400 to-blue-600',
      direction: 'up' // Primera: hacia arriba
    },
    { 
      name: 'California', 
      listings: 15, 
      image: '/images/destinations/california.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-purple-400 to-purple-600',
      direction: 'down' // Segunda: hacia abajo
    },
    { 
      name: 'New York', 
      listings: 12, 
      image: '/images/destinations/newyork.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-green-400 to-green-600',
      direction: 'up' // Tercera: hacia arriba
    },
    { 
      name: 'London', 
      listings: 8, 
      image: '/images/destinations/london.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-red-400 to-red-600',
      direction: 'down' // Cuarta: hacia abajo
    },
    { 
      name: 'Paris', 
      listings: 20, 
      image: '/images/destinations/paris.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-yellow-400 to-yellow-600',
      direction: 'up' // Quinta: hacia arriba
    },
    { 
      name: 'Tokyo', 
      listings: 18, 
      image: '/images/destinations/tokyo.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-pink-400 to-pink-600',
      direction: 'down' // Sexta: hacia abajo
    },
    { 
      name: 'Dubai', 
      listings: 14, 
      image: '/images/destinations/dubai.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-indigo-400 to-indigo-600',
      direction: 'up' // Séptima: hacia arriba
    },
    { 
      name: 'Barcelona', 
      listings: 16, 
      image: '/images/destinations/barcelona.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-orange-400 to-orange-600',
      direction: 'down' // Octava: hacia abajo
    },
    { 
      name: 'Rome', 
      listings: 11, 
      image: '/images/destinations/rome.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-teal-400 to-teal-600',
      direction: 'up' // Novena: hacia arriba
    },
    { 
      name: 'Sydney', 
      listings: 13, 
      image: '/images/destinations/sydney.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-cyan-400 to-cyan-600',
      direction: 'down' // Décima: hacia abajo
    },
    { 
      name: 'Miami', 
      listings: 9, 
      image: '/images/destinations/miami.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-emerald-400 to-emerald-600',
      direction: 'up' // Undécima: hacia arriba
    },
    { 
      name: 'Berlin', 
      listings: 17, 
      image: '/images/destinations/berlin.jpg', // 🔗 CAMBIAR URL AQUÍ
      color: 'from-violet-400 to-violet-600',
      direction: 'down' // Duodécima: hacia abajo
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Feature Places</h2>
          <h3 className="text-2xl text-gray-600">Explore By Destination</h3>
        </div>

        {/* Grid con animación de rompecabezas zigzag */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {destinations.map((destination, index) => (
            <div 
              key={index} 
              className={`group cursor-pointer ${
                isVisible 
                  ? destination.direction === 'up' ? 'animate-puzzle-up' : 'animate-puzzle-down'
                  : 'opacity-0'
              } puzzle-delay-${index * 150}`}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                {/* Imagen de fondo */}
                <div className="aspect-square relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback a gradiente si la imagen no carga
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const nextElement = target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  
                  {/* Gradiente de fallback */}
                  <div className={`absolute inset-0 bg-linear-to-br ${destination.color} items-center justify-center hidden`}>
                  <div className="text-center text-white">
                    <h4 className="text-lg font-bold mb-2">{destination.name}</h4>
                      <p className="text-sm opacity-90">{destination.listings} Listing{destination.listings !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  {/* Overlay con contenido */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white relative z-10">
                      <h4 className="text-lg font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                        {destination.name}
                      </h4>
                      <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        {destination.listings} Listing{destination.listings !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                  {/* Efecto de partículas flotantes */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full particle-1"></div>
                    <div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full particle-2"></div>
                    <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full particle-3"></div>
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full particle-4"></div>
                  </div>
                </div>
                
                {/* Borde animado */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white group-hover:border-opacity-30 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination mejorada */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-3">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-110 ${
                  page === 1 
                    ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
