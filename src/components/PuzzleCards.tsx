'use client';

import { useState } from 'react';

export default function PuzzleCards() {
  const [isAnimating, setIsAnimating] = useState(true);
  
  const destinations = [
    { 
      id: 1, 
      name: 'Restaurants', 
      count: '120+', 
      direction: 'up',
      icon: (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253v12.5"/>
        </svg>
      )
    },
    { 
      id: 2, 
      name: 'Hotels', 
      count: '80+', 
      direction: 'down',
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 3, 
      name: 'Shopping', 
      count: '150+', 
      direction: 'up',
      icon: (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      id: 4, 
      name: 'Entertainment', 
      count: '60+', 
      direction: 'down',
      icon: (
        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 5, 
      name: 'Health & Fitness', 
      count: '90+', 
      direction: 'up',
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: 6, 
      name: 'Services', 
      count: '200+', 
      direction: 'down',
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Feature Places</h2>
          <h3 className="text-2xl text-gray-600">Explore By Destination</h3>
        </div>

        {/* Contenedor de tarjetas con animación */}
        <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          onMouseEnter={() => setIsAnimating(false)}
          onMouseLeave={() => setIsAnimating(true)}
        >
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className={`
                bg-linear-to-br from-white to-gray-50 
                rounded-2xl shadow-xl p-8
                transition-all duration-500 ease-out
                flex flex-col items-center justify-center
                cursor-pointer
                transform
                border border-gray-200
                hover:shadow-2xl hover:scale-105 hover:border-blue-300
                hover:bg-linear-to-br hover:from-blue-50 hover:to-white
                ${isAnimating ? (destination.direction === 'up' ? 'animate-bounce-up' : 'animate-bounce-down') : ''}
                bounce-delay-${index * 200}
              `}
            >
              {/* Icono */}
              <div className="mb-4">
                {destination.icon}
              </div>
              
              {/* Nombre */}
              <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">
                {destination.name}
              </h4>
              
              {/* Contador */}
              <p className="text-sm text-gray-500">
                {destination.count} Listings
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
