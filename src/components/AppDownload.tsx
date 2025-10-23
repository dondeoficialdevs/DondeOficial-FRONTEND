'use client';

export default function AppDownload() {
  return (
    <section className="py-20 bg-linear-to-r from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">Download App</h2>
            <h3 className="text-2xl mb-6">Comprehensive All Great Destination Here</h3>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Dictumst integer tellus eros quam vestibulum ante tortor mollis adipisn pharetra curae curae and pulvinar porttitor
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center bg-white text-gray-900 px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L13.55 12l4.148-4.491zM5.864 2.658L16.802 8.99l-4.148 4.491L1.716 7.149l4.148-4.491z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center bg-white text-gray-900 px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-96 bg-linear-to-br from-blue-400 to-purple-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">DondeOficial App</h4>
                  <p className="text-sm opacity-90">Find amazing places</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
