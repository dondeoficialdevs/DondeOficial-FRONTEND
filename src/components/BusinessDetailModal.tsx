'use client';

import { useState, useEffect, useRef } from 'react';
import { Business } from '../types';
import { businessApi } from '../lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import ReviewsSection from './ReviewsSection';

interface BusinessDetailModalProps {
  businessId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessDetailModal({ businessId, isOpen, onClose }: BusinessDetailModalProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (isOpen && businessId) {
      loadBusiness(businessId);
      // Resetear posición y tamaño al centro cuando se abre
      setPosition({ x: 0, y: 0 });
      setSize({ width: 0, height: 0 }); // 0 significa tamaño por defecto
    } else {
      setPosition({ x: 0, y: 0 });
      setSize({ width: 0, height: 0 });
    }
  }, [isOpen, businessId]);

  const loadBusiness = async (id: number) => {
    try {
      setLoading(true);
      const businessData = await businessApi.getById(id);
      setBusiness(businessData);
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const containerRect = modalRef.current.parentElement?.getBoundingClientRect();
      if (containerRect) {
        // Calcular offset relativo al centro del contenedor
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        setDragOffset({
          x: e.clientX - centerX - position.x,
          y: e.clientY - centerY - position.y
        });
        setIsDragging(true);
        e.preventDefault();
      }
    }
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    if (modalRef.current) {
      e.stopPropagation();
      e.preventDefault();
      const rect = modalRef.current.getBoundingClientRect();
      // Si el tamaño es 0, usar el tamaño actual del elemento
      const currentWidth = size.width > 0 ? size.width : rect.width;
      const currentHeight = size.height > 0 ? size.height : rect.height;
      
      // Guardar el tamaño inicial si es la primera vez que se redimensiona
      if (size.width === 0 || size.height === 0) {
        setSize({ width: currentWidth, height: currentHeight });
      }
      
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: currentWidth,
        height: currentHeight
      });
      setResizeDirection(direction);
      setIsResizing(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && modalRef.current) {
        const containerRect = modalRef.current.parentElement?.getBoundingClientRect();
        if (containerRect) {
          const deltaX = e.clientX - resizeStart.x;
          const deltaY = e.clientY - resizeStart.y;
          
          let newWidth = resizeStart.width;
          let newHeight = resizeStart.height;
          let newX = position.x;
          let newY = position.y;
          
          const minWidth = 400;
          const minHeight = 300;
          const maxWidth = containerRect.width - 40;
          const maxHeight = containerRect.height - 40;
          
          // Redimensionar según la dirección
          if (resizeDirection.includes('right')) {
            newWidth = Math.min(maxWidth, Math.max(minWidth, resizeStart.width + deltaX));
          }
          if (resizeDirection.includes('left')) {
            newWidth = Math.min(maxWidth, Math.max(minWidth, resizeStart.width - deltaX));
            // Ajustar posición X para mantener el punto de anclaje (el ancho cambió)
            const widthDiff = newWidth - resizeStart.width;
            newX = position.x - widthDiff;
          }
          if (resizeDirection.includes('bottom')) {
            newHeight = Math.min(maxHeight, Math.max(minHeight, resizeStart.height + deltaY));
          }
          if (resizeDirection.includes('top')) {
            newHeight = Math.min(maxHeight, Math.max(minHeight, resizeStart.height - deltaY));
            // Ajustar posición Y para mantener el punto de anclaje (la altura cambió)
            const heightDiff = newHeight - resizeStart.height;
            newY = position.y - heightDiff;
          }
          
          setSize({ width: newWidth, height: newHeight });
          // Actualizar posición solo si se redimensiona desde izquierda o arriba
          if (resizeDirection.includes('left') || resizeDirection.includes('top')) {
            setPosition({ x: newX, y: newY });
          }
        }
      } else if (isDragging && modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        const containerRect = modalRef.current.parentElement?.getBoundingClientRect();
        if (containerRect) {
          // Calcular posición relativa al contenedor centrado
          const currentWidth = size.width || rect.width;
          const currentHeight = size.height || rect.height;
          const newX = e.clientX - containerRect.left - containerRect.width / 2 - dragOffset.x + currentWidth / 2;
          const newY = e.clientY - containerRect.top - containerRect.height / 2 - dragOffset.y + currentHeight / 2;
          
          // Limitar movimiento dentro de los bordes
          const maxX = containerRect.width / 2 - currentWidth / 2 - 20;
          const maxY = containerRect.height / 2 - currentHeight / 2 - 20;
          
          setPosition({
            x: Math.max(-maxX, Math.min(newX, maxX)),
            y: Math.max(-maxY, Math.min(newY, maxY))
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeDirection, resizeStart, position, size]);

  if (!isOpen) return null;

  const primaryImage = business?.images?.find(img => img.is_primary) || business?.images?.[0];
  const otherImages = business?.images?.filter((img, idx) => 
    !img.is_primary && (primaryImage ? img.id !== primaryImage.id : idx !== 0)
  ) || [];

  const normalizeSocialUrl = (url: string | undefined, platform: string) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('@')) {
      const username = url.substring(1);
      const urlMap: { [key: string]: string } = {
        facebook: `https://facebook.com/${username}`,
        instagram: `https://instagram.com/${username}`,
        tiktok: `https://tiktok.com/@${username}`,
        youtube: `https://youtube.com/@${username}`,
      };
      return urlMap[platform] || url;
    }
    return `https://${platform}.com/${url}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: size.width > 0 ? `${size.width}px` : 'auto',
          height: size.height > 0 ? `${size.height}px` : 'auto',
          maxWidth: '90vw',
          maxHeight: '90vh',
          minWidth: '400px',
          minHeight: '300px',
          cursor: isDragging ? 'grabbing' : 'default',
          transition: (isDragging || isResizing) ? 'none' : 'transform 0.2s ease-out'
        }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Resize Handles */}
        {/* Esquinas */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-50"
          style={{ cursor: 'nwse-resize' }}
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-50"
          style={{ cursor: 'nesw-resize' }}
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-50"
          style={{ cursor: 'nesw-resize' }}
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50"
          style={{ cursor: 'nwse-resize' }}
        />
        
        {/* Bordes */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'top')}
          className="absolute top-0 left-4 right-4 h-2 cursor-ns-resize z-50"
          style={{ cursor: 'ns-resize' }}
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          className="absolute bottom-0 left-4 right-4 h-2 cursor-ns-resize z-50"
          style={{ cursor: 'ns-resize' }}
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'left')}
          className="absolute left-0 top-4 bottom-4 w-2 cursor-ew-resize z-50"
          style={{ cursor: 'ew-resize' }}
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'right')}
          className="absolute right-0 top-4 bottom-4 w-2 cursor-ew-resize z-50"
          style={{ cursor: 'ew-resize' }}
        />

        {/* Header - Draggable */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">Detalles del Negocio</h2>
              {business && (
                <p className="text-sm text-white/90">{business.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : business ? (
            <div className="p-6">
              {/* Hero Image */}
              <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage.image_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  {business.category_name && (
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {business.category_name}
                    </span>
                  )}
                  <h1 className="text-3xl font-bold drop-shadow-lg">{business.name}</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Acerca de
                    </h3>
                    <p className="text-gray-800 leading-relaxed font-medium">{business.description}</p>
                  </div>

                  {/* Gallery */}
                  {otherImages.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Galería
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {otherImages.map((image) => (
                          <div key={image.id} className="relative group overflow-hidden rounded-lg">
                            <img
                              src={image.image_url}
                              alt={`${business.name} - Imagen ${image.id}`}
                              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Social Media */}
                  {(business.facebook_url || business.instagram_url || business.tiktok_url || business.youtube_url) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Síguenos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {business.facebook_url && (
                          <a
                            href={normalizeSocialUrl(business.facebook_url, 'facebook') || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-3 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all text-xs font-semibold"
                          >
                            Facebook
                          </a>
                        )}
                        {business.instagram_url && (
                          <a
                            href={normalizeSocialUrl(business.instagram_url, 'instagram') || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-3 py-2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all text-xs font-semibold"
                          >
                            Instagram
                          </a>
                        )}
                        {business.tiktok_url && (
                          <a
                            href={normalizeSocialUrl(business.tiktok_url, 'tiktok') || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-xs font-semibold"
                          >
                            TikTok
                          </a>
                        )}
                        {business.youtube_url && (
                          <a
                            href={normalizeSocialUrl(business.youtube_url, 'youtube') || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-3 py-2 bg-[#FF0000] text-white rounded-lg hover:bg-[#CC0000] transition-all text-xs font-semibold"
                          >
                            YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Contacto</h4>
                    <div className="space-y-3">
                      {/* Botón de Favoritos */}
                      <button
                        onClick={() => business && toggleFavorite(business)}
                        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all font-bold text-sm ${
                          business && isFavorite(business.id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                        }`}
                        title={business && isFavorite(business.id) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                      >
                        <svg 
                          className="w-5 h-5 mr-2" 
                          fill={business && isFavorite(business.id) ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {business && isFavorite(business.id) ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
                      </button>
                      {business.phone && (
                        <a
                          href={`tel:${business.phone}`}
                          className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-bold">Teléfono</p>
                            <p className="text-gray-900 font-bold">{business.phone}</p>
                          </div>
                        </a>
                      )}
                      
                      {business.email && (
                        <a
                          href={`mailto:${business.email}`}
                          className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-bold">Email</p>
                            <p className="text-gray-900 font-bold text-sm truncate">{business.email}</p>
                          </div>
                        </a>
                      )}

                      {business.address && (
                        <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-bold mb-1">Dirección</p>
                            <p className="text-gray-900 font-bold text-sm">{business.address}</p>
                          </div>
                        </div>
                      )}

                      {business.website && (
                        <a
                          href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm w-full"
                        >
                          Visitar Sitio Web
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Opening Hours */}
                  {business.opening_hours && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Horarios
                      </h4>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <pre className="text-gray-800 whitespace-pre-line font-semibold text-sm">
                          {business.opening_hours}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="px-6 pb-6">
                <ReviewsSection businessId={business.id} />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600">Error al cargar el negocio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

