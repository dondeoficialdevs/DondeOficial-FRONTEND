'use client';

import { Business } from '../types';
import Link from 'next/link';

interface BusinessListProps {
  businesses: Business[];
}

export default function BusinessList({ businesses }: BusinessListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <Link
          key={business.id}
          href={`/businesses/${business.id}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          {/* Imagen principal */}
          {business.images && business.images.length > 0 && business.images[0]?.image_url ? (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={business.images[0].image_url}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {business.name}
              </h3>
              {business.category_name && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {business.category_name}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {business.description}
            </p>

            <div className="space-y-2">
              {business.address && (
                <div className="flex items-start text-sm text-gray-500">
                  <span className="mr-2 text-gray-400">Location:</span>
                  <span className="flex-1">{business.address}</span>
                </div>
              )}
              
              {business.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2 text-gray-400">Phone:</span>
                  <span>{business.phone}</span>
                </div>
              )}
              
              {business.opening_hours && (
                <div className="flex items-start text-sm text-gray-500">
                  <span className="mr-2 text-gray-400">Hours:</span>
                  <span className="flex-1">{business.opening_hours}</span>
                </div>
              )}
            </div>

            {(business.website || business.email) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-4">
                  {business.website && (
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Website
                    </a>
                  )}
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Email
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
