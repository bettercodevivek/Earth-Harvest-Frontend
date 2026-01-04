import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Camera, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';

export default function ReviewForm({ productId, onClose, onSuccess }) {
  const { user, isAuthenticated, showToast } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    dogBreed: '',
    sizePurchased: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and review content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          userName: user.name || user.email?.split('@')[0],
          dogBreed: formData.dogBreed,
          sizePurchased: formData.sizePurchased,
          rating,
          title: formData.title,
          content: formData.content,
          images: [] // Can be extended later for image uploads
        })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Review Submitted',
          message: 'Thank you for your review!'
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summarize your experience"
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Review *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tell us about your experience with this product..."
                rows={6}
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Optional Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Dog Breed (Optional)
                </label>
                <input
                  type="text"
                  value={formData.dogBreed}
                  onChange={(e) => setFormData({ ...formData, dogBreed: e.target.value })}
                  placeholder="e.g., Golden Retriever"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Size Purchased (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sizePurchased}
                  onChange={(e) => setFormData({ ...formData, sizePurchased: e.target.value })}
                  placeholder="e.g., 30 lbs"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="flex-1 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

