'use client';

export default function DestinationCards() {
  const destinations = [
    { name: 'Australia', listings: 10, image: '/api/placeholder/300/200' },
    { name: 'California', listings: 15, image: '/api/placeholder/300/200' },
    { name: 'New York', listings: 12, image: '/api/placeholder/300/200' },
    { name: 'London', listings: 8, image: '/api/placeholder/300/200' },
    { name: 'Paris', listings: 20, image: '/api/placeholder/300/200' },
    { name: 'Tokyo', listings: 18, image: '/api/placeholder/300/200' },
    { name: 'Dubai', listings: 14, image: '/api/placeholder/300/200' },
    { name: 'Barcelona', listings: 16, image: '/api/placeholder/300/200' },
    { name: 'Rome', listings: 11, image: '/api/placeholder/300/200' },
    { name: 'Sydney', listings: 13, image: '/api/placeholder/300/200' },
    { name: 'Miami', listings: 9, image: '/api/placeholder/300/200' },
    { name: 'Berlin', listings: 17, image: '/api/placeholder/300/200' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Feature Places</h2>
          <h3 className="text-2xl text-gray-600">Explore By Destination</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {destinations.map((destination, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-square bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h4 className="text-lg font-bold mb-2">{destination.name}</h4>
                    <p className="text-sm opacity-90">{destination.listings} Listing</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  page === 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
