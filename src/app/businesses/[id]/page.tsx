'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { businessApi } from '@/lib/api';
import { Business, BusinessImage } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

  useEffect(() => {
    if (params.id) {
      loadBusiness(Number(params.id));
    }
  }, [params.id]);

  const loadBusiness = async (id: number) => {
    try {
      setLoading(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negocio no encontrado</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Inicio
          </Link>
            <span>/</span>
            <span className="text-gray-900">{business.name}</span>
          </nav>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Business Header with Gradient */}
          <div className="p-8 md:p-12 bg-linear-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1 mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {business.name}
                </h1>
                {business.category_name && (
                  <span className="inline-block bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
                    {business.category_name}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/businesses/${business.id}/edit`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                  {business.website && (
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg font-semibold"
                    >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l3-3m-3 3l-3-3m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Visitar Web
                    </a>
                  )}
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg font-semibold"
                    >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Llamar
                    </a>
                  )}
              </div>
            </div>
          </div>

          {/* Business Content */}
          <div className="p-8 md:p-12">
            {/* Galería de Imágenes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Galería de Imágenes</h2>
                <button
                  onClick={() => setShowAddImages(!showAddImages)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {showAddImages ? 'Cancelar' : 'Agregar Imágenes'}
                </button>
              </div>

              {/* Sección para agregar imágenes */}
              {showAddImages && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar imágenes (máximo 10 en total)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      aria-label="Seleccionar imágenes para agregar al negocio"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB por imagen.
                    </p>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              aria-label={`Eliminar imagen ${index + 1}`}
                              title="Eliminar imagen"
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImages ? 'Subiendo...' : `Subir ${newImages.length} imagen${newImages.length > 1 ? 'es' : ''}`}
                    </button>
                  )}
                </div>
              )}

              {business.images && business.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {business.images.map((image) => (
                    <div key={image.id} className="relative group overflow-hidden rounded-lg">
                      <img
                        src={image.image_url}
                        alt={`${business.name} - Imagen ${image.id}`}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                      {image.is_primary && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deletingImageId === image.id}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar imagen"
                      >
                        {deletingImageId === image.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No hay imágenes disponibles</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Description */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Acerca de</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {business.description}
                  </p>
                </div>

                {/* Contact Information */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Información de contacto</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {business.address && (
                      <div className="bg-gray-50 rounded-lg p-4 flex items-start hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Dirección</p>
                          <p className="text-gray-700">{business.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {business.phone && (
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-green-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Teléfono</p>
                          <a
                            href={`tel:${business.phone}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {business.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {business.email && (
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-purple-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Email</p>
                          <a
                            href={`mailto:${business.email}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {business.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Opening Hours */}
                {business.opening_hours && (
                  <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Horarios</h2>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <pre className="text-gray-700 whitespace-pre-line font-sans">
                        {business.opening_hours}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {(business.latitude && business.longitude) && (
                  <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Ubicación</h2>
                    </div>
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-600 opacity-20"></div>
                      <div className="relative z-10 text-center p-6 bg-white bg-opacity-90 rounded-lg">
                        <svg className="w-16 h-16 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-700 font-semibold mb-2">
                          Ver en el mapa
                        </p>
                        <p className="text-sm text-gray-500">
                          {business.latitude.toFixed(4)}, {business.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar el negocio <strong>{business?.name}</strong>? 
              Esta acción no se puede deshacer y también se eliminarán todas las imágenes asociadas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
