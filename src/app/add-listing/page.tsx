'use client';

import { useState, useEffect } from 'react';
import { businessApi, categoryApi } from '../../lib/api';
import { Category } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AddListingPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    category_id: '',
    opening_hours: '',
    latitude: '',
    longitude: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del negocio es requerido';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'La categoría es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'La URL debe comenzar con http:// o https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const businessData = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
      };

      await businessApi.create(businessData);
      setSubmitted(true);
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        category_id: '',
        opening_hours: '',
        latitude: '',
        longitude: ''
      });
    } catch (error: unknown) {
      console.error('Error creating business:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error creating listing. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Listing Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for submitting your business listing. We&apos;ll review it and publish it soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Another Listing
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Añade Tu Negocio</h1>
            <p className="text-xl text-gray-600">
              Promociona tu negocio en DondeOficial y llega a más clientes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre de tu negocio"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe tu negocio en detalle..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 20 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Business address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="correo@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.website ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://tu-sitio-web.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            <div>
              <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700 mb-2">
                Opening Hours
              </label>
              <input
                type="text"
                id="opening_hours"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Listing'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
