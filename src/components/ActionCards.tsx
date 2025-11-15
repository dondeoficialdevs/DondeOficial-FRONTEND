'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ActionCards() {
  const whatsappNumber = '1234567890'; // Reemplaza con tu número de WhatsApp
  const whatsappMessage = encodeURIComponent('¡Hola! Me gustaría obtener más información.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Imágenes de fondo desde la carpeta public
  const whatsappCardImage = '/images/action-cards/fondo-whatsapp.avif';
  const directoryCardImage = '/images/action-cards/Fondo-turismo.jpg';

  const whatsappRef = useRef<HTMLAnchorElement>(null);
  const directoryRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (whatsappRef.current) {
      whatsappRef.current.style.backgroundImage = `url(${whatsappCardImage})`;
    }
    if (directoryRef.current) {
      directoryRef.current.style.backgroundImage = `url(${directoryCardImage})`;
    }
  }, [whatsappCardImage, directoryCardImage]);

  return (
    <section className="relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden py-8">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Tarjeta WhatsApp */}
          <a
            ref={whatsappRef}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 min-h-[180px] action-card-whatsapp"
            data-bg-image={whatsappCardImage}
          >
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/60 to-black/40 group-hover:from-black/60 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-500"></div>
            
            {/* Gradiente verde sutil */}
            <div className="absolute inset-0 bg-linear-to-r from-green-600/30 via-transparent to-transparent"></div>

            {/* Contenido */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Icono y texto principal */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Icono WhatsApp */}
                  <div className="shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.49 1.32 5.01L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm.01 18.05c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.69 8.24-8.23 8.24z"/>
                      <path d="M16.53 13.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.66.81-.81.98-.15.17-.3.19-.56.07-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14 0-.3-.01-.47-.01s-.27.04-.41.2c-.15.17-.57.56-.57 1.36 0 .8.58 1.58.66 1.69.08.11 1.14 1.74 2.76 2.41 1.62.67 1.62.45 1.92.42.3-.03 1.17-.48 1.33-.97.17-.48.17-.9.12-.97-.05-.08-.22-.13-.47-.26z"/>
                    </svg>
                  </div>
                  
                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Contacto Directo</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                      Escríbenos por WhatsApp
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      Contáctanos directamente y te responderemos al instante
                    </p>
                  </div>
                </div>

                {/* Flecha */}
                <div className="shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:translate-x-1 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Efecto de brillo al hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </a>

          {/* Tarjeta Directorio/Turismo */}
          <Link
            ref={directoryRef}
            href="/listings"
            className="group relative block rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 min-h-[180px] action-card-directory"
            data-bg-image={directoryCardImage}
          >
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/60 to-black/40 group-hover:from-black/60 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-500"></div>
            
            {/* Gradiente azul sutil */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/30 via-indigo-600/20 to-transparent"></div>

            {/* Contenido */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Icono y texto principal */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Icono Directorio */}
                  <div className="shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  
                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                      <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Explorar</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                      Explora el Directorio
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      Descubre todos los negocios y servicios de turismo disponibles
                    </p>
                  </div>
                </div>

                {/* Flecha */}
                <div className="shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:translate-x-1 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Efecto de brillo al hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
