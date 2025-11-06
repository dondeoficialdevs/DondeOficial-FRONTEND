'use client';

import { useState } from 'react';
import { newsletterApi } from '@/lib/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await newsletterApi.subscribe(email);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: unknown) {
      console.error('Error subscribing:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al suscribirse. Por favor intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-linear-to-r from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Obtén Recompensas Especiales</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Suscríbete a nuestro boletín y recibe ofertas exclusivas, consejos de viaje y recompensas especiales directamente en tu bandeja de entrada.
          </p>
          
          <div className="max-w-md mx-auto">
            {submitted ? (
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
                ✓ ¡Suscrito exitosamente!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                {error && (
                  <div className="w-full mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Suscribiendo...' : 'Suscribirse +'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
