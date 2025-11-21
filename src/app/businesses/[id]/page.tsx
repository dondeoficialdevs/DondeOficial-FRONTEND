'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { businessApi, authApi } from '@/lib/api';
import { Business, BusinessImage } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';

export default function BusinessDetail() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAddImages, setShowAddImages] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
    if (params.id) {
      loadBusiness(Number(params.id));
    }
  }, [params.id]);

  const loadBusiness = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar autenticación directamente
      const authenticated = authApi.isAuthenticated();
      
      // Si el usuario es admin, intentar obtener el negocio incluyendo pendientes
      if (authenticated) {
        try {
          const businessData = await businessApi.getByIdForAdmin(id);
          setBusiness(businessData);
          return;
        } catch (adminError) {
          // Si falla como admin, intentar como usuario normal
          console.log('No se pudo obtener como admin, intentando como usuario normal');
        }
      }
      
      // Para usuarios no autenticados o si falló como admin, usar método normal
      const businessData = await businessApi.getById(id);
      setBusiness(businessData);
    } catch (error) {
      console.error('Error loading business:', error);
      setError('Negocio no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!business) return;
    
    setDeleting(true);
    try {
      await businessApi.delete(business.id);
      router.push('/listings');
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Error al eliminar el negocio. Por favor intenta de nuevo.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const currentImageCount = business?.images?.length || 0;

    if (currentImageCount + newImages.length + fileArray.length > 10) {
      alert('Máximo 10 imágenes permitidas en total');
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} es muy grande. Máximo 5MB por imagen`);
        return;
      }

      validFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        previews.push(result);
        if (previews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setNewImages([...newImages, ...validFiles]);
  };

  const removeImage = (index: number) => {
    const newFiles = [...newImages];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setNewImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleUploadImages = async () => {
    if (!business || newImages.length === 0) return;

    setUploadingImages(true);
    try {
      await businessApi.addImages(business.id, newImages);
      setNewImages([]);
      setImagePreviews([]);
      setShowAddImages(false);
      await loadBusiness(business.id);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imágenes. Por favor intenta de nuevo.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!business) return;

    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      return;
    }

    setDeletingImageId(imageId);
    try {
      await businessApi.deleteImage(business.id, imageId);
      await loadBusiness(business.id);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen. Por favor intenta de nuevo.');
    } finally {
      setDeletingImageId(null);
    }
  };

  // Obtener imagen principal
  const primaryImage = business?.images?.find(img => img.is_primary) || business?.images?.[0];
  const otherImages = business?.images?.filter((img, idx) => 
    !img.is_primary && (primaryImage ? img.id !== primaryImage.id : idx !== 0)
  ) || [];

  // Función para normalizar URLs de redes sociales
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

  // Función para normalizar URL de WhatsApp
  const normalizeWhatsAppUrl = (whatsapp: string | undefined) => {
    if (!whatsapp) return '#';
    
    // Si ya es un enlace completo, devolverlo
    if (whatsapp.startsWith('http://') || whatsapp.startsWith('https://') || whatsapp.startsWith('wa.me/')) {
      if (whatsapp.startsWith('wa.me/')) {
        return `https://${whatsapp}`;
      }
      return whatsapp;
    }
    
    // Si es un número, convertirlo a formato wa.me
    // Remover espacios, guiones, paréntesis y otros caracteres
    const cleanNumber = whatsapp.replace(/[\s\-\(\)\+]/g, '');
    
    // Si no empieza con código de país, asumir que es número local (agregar código por defecto si es necesario)
    if (cleanNumber.match(/^\d{10}$/)) {
      // Número de 10 dígitos, agregar código de país por defecto (Colombia: 57)
      return `https://wa.me/57${cleanNumber}`;
    }
    
    // Si ya tiene código de país
    if (cleanNumber.match(/^\d{10,15}$/)) {
      return `https://wa.me/${cleanNumber}`;
    }
    
    return `https://wa.me/${cleanNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Negocio no encontrado</h1>
          <p className="text-gray-600 mb-8">El negocio que buscas no existe o ha sido eliminado.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">
            Inicio
          </Link>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/listings" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">
            Directorio
          </Link>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-bold truncate max-w-xs">{business.name}</span>
        </nav>

        {/* Hero Section con Imagen Principal */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
          {primaryImage ? (
            <div className="relative h-[500px] md:h-[600px]">
              <img
                src={primaryImage.image_url}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30"></div>
              
              {/* Contenido sobre la imagen */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="max-w-4xl">
                  {business.category_name && (
                    <span className="inline-block bg-white/30 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-full mb-4 border-2 border-white/40 shadow-lg">
                      {business.category_name}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
                    {business.name}
                  </h1>
                  {business.description && (
                    <p className="text-lg md:text-xl text-white max-w-2xl line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium leading-relaxed">
                      {business.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción flotantes */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                {/* Botón de favoritos - Visible para todos */}
                <button
                  onClick={() => business && toggleFavorite(business)}
                  className={`inline-flex items-center justify-center px-5 py-3 rounded-xl transition-all shadow-2xl font-bold border-2 backdrop-blur-sm ${
                    business && isFavorite(business.id)
                      ? 'bg-red-500 text-white border-white/30 hover:bg-red-600'
                      : 'bg-white text-red-500 border-white/50 hover:bg-red-50'
                  }`}
                  title={business && isFavorite(business.id) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={business && isFavorite(business.id) ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                {/* Botones de administración - Solo para usuarios autenticados */}
                {isAuthenticated && (
                  <>
                    <Link
                      href={`/businesses/${business.id}/edit`}
                      className="inline-flex items-center justify-center px-5 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all shadow-2xl font-bold border-2 border-white/50 backdrop-blur-sm group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center justify-center px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-2xl font-bold border-2 border-white/30 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[500px] md:h-[600px] bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="text-center text-white p-8 relative z-10">
                <svg className="w-24 h-24 mx-auto mb-6 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">{business.name}</h1>
                {business.category_name && (
                  <span className="inline-block bg-white/30 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-full border-2 border-white/40 shadow-lg">
                    {business.category_name}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Acerca de</h2>
              </div>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                {business.description}
              </p>
            </div>

            {/* Galería de Imágenes */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Galería</h2>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowAddImages(!showAddImages)}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {showAddImages ? 'Cancelar' : 'Agregar'}
                  </button>
                )}
              </div>

              {/* Sección para agregar imágenes */}
              {showAddImages && (
                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Seleccionar imágenes (máximo 10 en total)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-700 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                    />
                    <p className="mt-2 text-xs text-gray-600 font-medium">
                      Formatos: JPG, PNG. Tamaño máximo: 5MB por imagen.
                    </p>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-bold text-gray-800 mb-3">Vista previa:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg shadow-md"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newImages.length > 0 && (
                    <button
                      onClick={handleUploadImages}
                      disabled={uploadingImages}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImages ? 'Subiendo...' : `Subir ${newImages.length} imagen${newImages.length > 1 ? 'es' : ''}`}
                    </button>
                  )}
                </div>
              )}

              {otherImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {otherImages.map((image) => (
                    <div key={image.id} className="relative group overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={image.image_url}
                        alt={`${business.name} - Imagen ${image.id}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                        onClick={() => setSelectedImageIndex(otherImages.findIndex(img => img.id === image.id))}
                      />
                      {isAuthenticated && (
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          disabled={deletingImageId === image.id}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
                          title="Eliminar imagen"
                        >
                          {deletingImageId === image.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-700 font-bold">No hay imágenes adicionales</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Redes Sociales y WhatsApp */}
            {(business.facebook_url || business.instagram_url || business.tiktok_url || business.youtube_url || business.whatsapp_url) && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Síguenos</h3>
                    <p className="text-sm text-gray-600">Conéctate con nosotros</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {business.facebook_url && (
                    <a
                      href={normalizeSocialUrl(business.facebook_url, 'facebook') || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="font-semibold text-sm">Facebook</span>
                    </a>
                  )}
                  {business.instagram_url && (
                    <a
                      href={normalizeSocialUrl(business.instagram_url, 'instagram') || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="font-semibold text-sm">Instagram</span>
                    </a>
                  )}
                  {business.tiktok_url && (
                    <a
                      href={normalizeSocialUrl(business.tiktok_url, 'tiktok') || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <span className="font-semibold text-sm">TikTok</span>
                    </a>
                  )}
                  {business.youtube_url && (
                    <a
                      href={normalizeSocialUrl(business.youtube_url, 'youtube') || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-[#FF0000] text-white rounded-xl hover:bg-[#CC0000] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="font-semibold text-sm">YouTube</span>
                    </a>
                  )}
                </div>

                {/* WhatsApp - Botón destacado */}
                {business.whatsapp_url && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={normalizeWhatsAppUrl(business.whatsapp_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-5 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl hover:from-[#20BA5A] hover:to-[#0F7A6F] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                    >
                      <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <div className="text-left flex-1">
                        <div className="font-bold text-base">Contactar por WhatsApp</div>
                        <div className="text-xs opacity-90">Ventas y Domicilios</div>
                      </div>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Información de Contacto */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contacto</h3>
              </div>
              
              <div className="space-y-4">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold mb-1">Teléfono</p>
                      <p className="text-gray-900 font-bold text-lg">{business.phone}</p>
                    </div>
                  </a>
                )}
                
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 font-bold mb-1">Email</p>
                      <p className="text-gray-900 font-bold text-base truncate" title={business.email}>{business.email}</p>
                    </div>
                  </a>
                )}

                {business.address && (
                  <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold mb-1">Dirección</p>
                      <p className="text-gray-900 font-bold text-sm leading-relaxed">{business.address}</p>
                    </div>
                  </div>
                )}

                {business.website && (
                  <a
                    href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Visitar Sitio Web
                  </a>
                )}
              </div>
            </div>

            {/* Horarios */}
            {business.opening_hours && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Horarios</h3>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200">
                  <pre className="text-gray-800 whitespace-pre-line font-semibold text-sm leading-relaxed">
                    {business.opening_hours}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Confirmar eliminación</h3>
            <p className="text-gray-700 mb-8 text-center">
              ¿Estás seguro de que deseas eliminar el negocio <strong className="text-red-600">{business?.name}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
