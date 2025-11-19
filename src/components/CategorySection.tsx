'use client';

import { useRouter } from 'next/navigation';
import { Category } from '../types';

interface CategorySectionProps {
  categories: Category[];
  onCategorySelect?: (categoryName: string) => void;
}

const getCategoryIcon = (name: string) => {
  const icons: { [key: string]: React.ReactElement } = {
    'Belleza': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Entretenimiento': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Gastronomía': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545zM12 6.253v12.5" />
      </svg>
    ),
    'Viajes y turismo': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Bienestar y salud': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'Servicios': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
      </svg>
    ),
    'Productos': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'Cerca de mí': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return icons[name] || (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

export default function CategorySection({ categories, onCategorySelect }: CategorySectionProps) {
  const router = useRouter();
  
  // Categorías principales que coinciden con la captura
  const mainCategories = [
    'Belleza', 'Entretenimiento', 'Gastronomía', 'Viajes y turismo',
    'Bienestar y salud', 'Servicios', 'Productos', 'Cerca de mí'
  ];

  // Mapeo de categorías del frontend a nombres del backend
  const getCategoryBackendName = (frontendName: string): string => {
    const foundCategory = categories.find(cat => 
      cat.name.toLowerCase() === frontendName.toLowerCase() ||
      cat.name.toLowerCase().includes(frontendName.toLowerCase()) ||
      frontendName.toLowerCase().includes(cat.name.toLowerCase())
    );
    
    if (foundCategory) {
      return foundCategory.name;
    }
    
    return frontendName;
  };

  const handleCategoryClick = (categoryName: string) => {
    const backendCategoryName = getCategoryBackendName(categoryName);
    
    // Si hay un callback personalizado, usarlo primero
    if (onCategorySelect) {
      onCategorySelect(backendCategoryName);
    }
    
    // Navegar a listings con el filtro de categoría
    const encodedCategory = encodeURIComponent(backendCategoryName);
    router.push(`/listings?category=${encodedCategory}`);
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-2">
          {mainCategories.map((cat) => {
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center space-y-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-700 min-w-[80px]"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(cat)}
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}