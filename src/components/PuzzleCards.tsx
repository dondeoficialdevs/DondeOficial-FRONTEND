'use client';

import { useState } from 'react';

export default function PuzzleCards() {
  const [isAnimating, setIsAnimating] = useState(true);
  
  const cards = [
    { id: 1, text: 'Dondeoficial', direction: 'up', icon: '📍' },
    { id: 2, text: 'Dondeoficial', direction: 'down', icon: '📍' },
    { id: 3, text: 'Dondeoficial', direction: 'up', icon: '📍' },
    { id: 4, text: 'Dondeoficial', direction: 'down', icon: '📍' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 fade-in">
      <div className="w-full max-w-4xl">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Dondeoficial
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra negocios cerca de ti
          </p>
        </div>

        {/* Contenedor principal */}
        <div 
          className="grid grid-cols-4 gap-6"
          onMouseEnter={() => setIsAnimating(false)}
          onMouseLeave={() => setIsAnimating(true)}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`
                bg-linear-to-br from-white to-gray-50 
                rounded-2xl shadow-xl 
                transition-all duration-500 ease-out
                flex flex-col items-center justify-center
                min-h-[200px]
                cursor-pointer
                transform
                border border-gray-200
                ${isAnimating ? (card.direction === 'up' ? 'animate-bounce-up' : 'animate-bounce-down') : ''}
                bounce-delay-${index * 200}
                hover:shadow-2xl hover:scale-105 hover:border-blue-300
                hover:bg-linear-to-br hover:from-blue-50 hover:to-white
              `}
            >
              {/* Icono de localización */}
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {card.icon}
              </div>
              
              {/* Texto */}
              <span className="text-xl font-semibold text-gray-800 text-center">
                {card.text}
              </span>
              
              {/* Subtítulo */}
              <span className="text-sm text-gray-500 mt-2">
                Negocio {card.id}
              </span>
            </div>
          ))}
        </div>

        {/* Footer elegante */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-lg">
            Descubre los mejores negocios de tu ciudad
          </p>
        </div>
      </div>
    </div>
  );
}
