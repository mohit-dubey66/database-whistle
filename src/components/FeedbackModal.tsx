import React, { useState } from 'react';
import { X } from 'lucide-react';
// import LoadingButton from './LoadingButton';
import { useFeedbackStore } from '../store/useFeedbackStore';
import LoadingButton from './LoadingButton';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Rating {
  interface: number;
  safety: number;
  reactions: number;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<Rating>({
    interface: 0,
    safety: 0,
    reactions: 0
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submitFeedback = useFeedbackStore(state => state.submitFeedback);

  if (!isOpen) return null;

  const handleRatingChange = (type: keyof Rating, value: number) => {
    setRating(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitFeedback({
        interfaceRating: rating.interface,
        safetyRating: rating.safety,
        reactionsRating: rating.reactions,
        feedback
      });
      onClose();
      // Reset form
      setRating({ interface: 0, safety: 0, reactions: 0 });
      setFeedback('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingScale = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string;
  }) => (
    <div className="mb-8">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
              ${value === num 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Not likely at all</span>
        <span>Extremely likely</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Share your feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RatingScale
            value={rating.interface}
            onChange={(value) => handleRatingChange('interface', value)}
            label="1. How satisfied are you with the overall user interface and design?"
          />

          <RatingScale
            value={rating.safety}
            onChange={(value) => handleRatingChange('safety', value)}
            label="2. How safe do you feel sharing your posts anonymously?"
          />

          <RatingScale
            value={rating.reactions}
            onChange={(value) => handleRatingChange('reactions', value)}
            label="3. How effective are the reactions in helping you engage with posts?"
          />

          <div>
            <label 
              htmlFor="feedback" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tell us something that keeps coming you back...
            </label>
            <textarea
              id="feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Share your thoughts..."
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting..."
              disabled={!rating.interface || !rating.safety || !rating.reactions}
              className="px-8"
            >
              Submit Feedback
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}