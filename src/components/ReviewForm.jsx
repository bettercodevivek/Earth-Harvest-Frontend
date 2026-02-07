import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, AlertCircle } from 'lucide-react';
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
          images: []
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="bg-[#FAF7F2] rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden shadow-sm border border-[#E8DFD0] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="px-6 py-4 border-b border-[#E8DFD0] bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2D4A3E]">Write a Review</h2>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#C8945C] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* RATING SECTION */}
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-2.5">
                  Rating <span className="text-gray-400">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-[#C8945C] fill-[#C8945C]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* TITLE INPUT */}
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-1.5">
                  Review Title <span className="text-gray-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summarize your experience"
                  className="w-full border border-[#E8DFD0] bg-white px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none rounded-md"
                  required
                />
              </div>

              {/* REVIEW CONTENT */}
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-1.5">
                  Your Review <span className="text-gray-400">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tell us about your experience"
                  rows={5}
                  className="w-full border border-[#E8DFD0] bg-white px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none resize-none rounded-md"
                  required
                />
              </div>

              {/* OPTIONAL FIELDS */}
              <div className="space-y-4 pt-3 border-t border-[#E8DFD0]">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D4A3E] mb-1.5">
                      Dog Breed
                    </label>
                    <input
                      type="text"
                      value={formData.dogBreed}
                      onChange={(e) => setFormData({ ...formData, dogBreed: e.target.value })}
                      placeholder="e.g., Golden Retriever"
                      className="w-full border border-[#E8DFD0] bg-white px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D4A3E] mb-1.5">
                      Size Purchased
                    </label>
                    <input
                      type="text"
                      value={formData.sizePurchased}
                      onChange={(e) => setFormData({ ...formData, sizePurchased: e.target.value })}
                      placeholder="e.g., 30 lbs"
                      className="w-full border border-[#E8DFD0] bg-white px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-gray-400 focus:border-[#C8945C] focus:outline-none rounded-md"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-[#E8DFD0] bg-white">
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-[#2D4A3E] hover:text-[#C8945C] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className="px-4 py-2 text-sm font-medium bg-[#C8945C] text-white hover:bg-[#B8844C] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}