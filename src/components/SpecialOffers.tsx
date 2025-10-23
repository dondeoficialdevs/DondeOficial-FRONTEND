'use client';

export default function SpecialOffers() {
  return (
    <section className="py-16 bg-linear-to-r from-orange-500 to-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-bold">Splash Yourself Bigger Offer on Everyday</h2>
          </div>
          <p className="text-xl mb-8 opacity-90">We Have Special Offers Every Find your offer</p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Explore Now
          </button>
        </div>
      </div>
    </section>
  );
}
