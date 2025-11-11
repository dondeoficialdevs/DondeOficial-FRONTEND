'use client';

import Link from 'next/link';

export default function SpecialOffers() {
  const whatsappNumber = '1234567890'; // Reemplaza con tu número de WhatsApp
  const whatsappMessage = encodeURIComponent('¡Hola! Me gustaría obtener más información.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden m-0">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10 m-0 px-4 sm:px-6 lg:px-8 py-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 m-0">
          {/* Tarjeta WhatsApp - Diseño Moderno */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl p-2.5 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden cursor-pointer m-0 min-h-[140px] card-whatsapp-bg"
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-500"></div>
            
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-linear-to-r from-green-600/70 via-green-600/50 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white bg-opacity-20 backdrop-blur-md rounded-full px-3 py-1 w-fit border border-white border-opacity-30 shrink-0">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span className="text-white text-[10px] font-semibold uppercase tracking-wide">Directo</span>
              </div>

              {/* Icon - WhatsApp Chat */}
              <div className="shrink-0 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-2.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white border-opacity-30">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.49 1.32 5.01L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm.01 18.05c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.69 8.24-8.23 8.24z"/>
                  <path d="M16.53 13.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.66.81-.81.98-.15.17-.3.19-.56.07-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14 0-.3-.01-.47-.01s-.27.04-.41.2c-.15.17-.57.56-.57 1.36 0 .8.58 1.58.66 1.69.08.11 1.14 1.74 2.76 2.41 1.62.67 1.62.45 1.92.42.3-.03 1.17-.48 1.33-.97.17-.48.17-.9.12-.97-.05-.08-.22-.13-.47-.26z"/>
                </svg>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  Escríbenos por WhatsApp
                </h3>
                <p className="text-green-50 text-xs md:text-sm leading-snug font-medium line-clamp-2">
                  Contáctanos directamente y te responderemos al instante.
                </p>
              </div>

              {/* CTA Arrow */}
              <div className="shrink-0 text-white group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white to-transparent opacity-20"></div>
          </a>

          {/* Tarjeta BusinessList - Diseño Moderno */}
          <Link
            href="/listings"
            className="group relative rounded-2xl p-2.5 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden cursor-pointer m-0 min-h-[140px] card-directory-bg"
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-500"></div>
            
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/70 via-indigo-600/50 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white bg-opacity-20 backdrop-blur-md rounded-full px-3 py-1 w-fit border border-white border-opacity-30 shrink-0">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span className="text-white text-[10px] font-semibold uppercase tracking-wide">Explorar</span>
              </div>

              {/* Icon - Business Directory */}
              <div className="shrink-0 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-2.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white border-opacity-30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  Explora el Directorio
                </h3>
                <p className="text-blue-50 text-xs md:text-sm leading-snug font-medium line-clamp-2">
                  Descubre todos los negocios y servicios disponibles en tu área.
                </p>
              </div>

              {/* CTA Arrow */}
              <div className="shrink-0 text-white group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white to-transparent opacity-20"></div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
