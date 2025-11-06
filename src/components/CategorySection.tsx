'use client';

import { Category } from '../types';

interface CategorySectionProps {
  categories: Category[];
  onCategorySelect?: (categoryName: string) => void;
}

const getCategoryIcon = (categoryName: string) => {
  const icons: { [key: string]: React.ReactElement } = {
    'Restaurant': (
      <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545zM12 6.253v12.5M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545z" />
      </svg>
    ),
    'Museums': (
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'Game Field': (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Job & Feed': (
      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
      </svg>
    ),
    'Party Center': (
      <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    'Fitness Zone': (
      <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    'Restaurantes': (
      <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545zM12 6.253v12.5M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545z" />
      </svg>
    ),
  };
  return icons[categoryName] || (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

export default function CategorySection({ categories, onCategorySelect }: CategorySectionProps) {
  // Si no hay categorías de la API, mostrar las predeterminadas como el sitio original
  const defaultCategories = [
    { id: 1, name: 'Museums', description: 'Explore museums and galleries' },
    { id: 2, name: 'Restaurant', description: 'Find great restaurants' },
    { id: 3, name: 'Game Field', description: 'Entertainment and gaming' },
    { id: 4, name: 'Job & Feed', description: 'Professional services' },
    { id: 5, name: 'Party Center', description: 'Events and celebrations' },
    { id: 6, name: 'Fitness Zone', description: 'Health and fitness' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explora Por Destino</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category) => {
            const icon = getCategoryIcon(category.name);
            
            return (
              <div
                key={category.id}
                onClick={() => onCategorySelect?.(category.name)}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">10 Negocios</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}