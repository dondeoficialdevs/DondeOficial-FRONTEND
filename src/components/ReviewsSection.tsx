'use client';

import { useState, useEffect } from 'react';
import { Review, ReviewRating } from '../types';
import { reviewApi } from '../lib/api';

interface ReviewsSectionProps {
  businessId: number;
}

export default function ReviewsSection({ businessId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<ReviewRating>({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    user_name: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (businessId) {
      loadReviews();
      loadRating();
    }
  }, [businessId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewApi.getByBusinessId(businessId);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRating = async () => {
    try {
      const data = await reviewApi.getRating(businessId);
      setRating(data);
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    try {
      setSubmitting(true);
      await reviewApi.create({
        business_id: businessId,
        rating: formData.rating,
        comment: formData.comment || undefined,
        user_name: formData.user_name || undefined,
      });
      
      // Recargar reviews y rating
      await loadReviews();
      await loadRating();
      
      // Reset form
      setFormData({
        rating: 0,
        comment: '',
        user_name: '',
      });
      setShowForm(false);
      alert('¡Gracias por tu calificación!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la calificación. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number, interactive = false, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    const stars = [];
    const displayRating = interactive ? hoveredStar || formData.rating : ratingValue;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => setFormData({ ...formData, rating: i }) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
          disabled={!interactive}
        >
          <svg
            className={starSize}
            fill={i <= displayRating ? '#FF6B35' : 'currentColor'}
            viewBox="0 0 20 20"
            style={{ color: i <= displayRating ? '#FF6B35' : '#d1d5db' }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Calificaciones y Comentarios</h3>
          {rating.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(rating.averageRating, false, 'md')}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {rating.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({rating.totalReviews} {rating.totalReviews === 1 ? 'calificación' : 'calificaciones'})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff7a33] transition-colors font-medium"
        >
          {showForm ? 'Cancelar' : 'Calificar'}
        </button>
      </div>

      {/* Formulario de calificación */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-5 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
          <div className="mb-5">
            <label className="block text-base font-bold text-gray-900 mb-3">
              Tu calificación *
            </label>
            <div className="flex items-center gap-2" onMouseLeave={() => setHoveredStar(0)}>
              {renderStars(0, true, 'lg')}
              {formData.rating > 0 && (
                <span className="ml-2 text-base font-semibold text-gray-900">
                  {formData.rating} {formData.rating === 1 ? 'estrella' : 'estrellas'}
                </span>
              )}
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="user_name" className="block text-base font-bold text-gray-900 mb-2">
              Tu nombre
            </label>
            <input
              type="text"
              id="user_name"
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] text-gray-900 font-medium placeholder:text-gray-500"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="comment" className="block text-base font-bold text-gray-900 mb-2">
              Tu comentario
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] resize-none text-gray-900 font-medium placeholder:text-gray-500"
              placeholder="Comparte tu experiencia..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || formData.rating === 0}
            className="w-full px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff7a33] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar Calificación'}
          </button>
        </form>
      )}

      {/* Lista de reseñas */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B35] border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-700 font-medium">Cargando calificaciones...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-700 font-medium text-base">No hay calificaciones aún. ¡Sé el primero en calificar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-5 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating, false, 'sm')}
                    </div>
                    <span className="font-bold text-base text-gray-900">
                      {review.user_name || 'Usuario Anónimo'}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {new Date(review.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-900 mt-3 text-base font-medium leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

