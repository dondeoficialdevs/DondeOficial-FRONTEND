'use client';

export default function VideoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Checkout List</h2>
          <h3 className="text-2xl text-gray-600 mb-6">Professional planners for your vacation</h3>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Risus urnas Iaculis per amet vestibulum luctus tincidunt ultricies aenean quam eros eleifend sodales cubilia mattis quam.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video bg-linear-to-br from-blue-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 group" aria-label="Play video">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="text-lg font-semibold mb-2">Play Video</h4>
              <p className="text-sm opacity-90">Discover amazing destinations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
