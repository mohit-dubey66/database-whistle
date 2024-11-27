import React, { useState } from 'react';
import { X } from 'lucide-react';
import { retrieveUuidByEmail } from '../store/useUserStore';

interface UuidRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUuidRecovered: (uuid: string) => void;
}

export default function UuidRecoveryModal({ isOpen, onClose, onUuidRecovered }: UuidRecoveryModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await retrieveUuidByEmail(email);
      if (result) {
        onUuidRecovered(result.uuid);
        onClose();
      } else {
        setError('No Insider ID found for this email address.');
      }
    } catch (err) {
      setError('Failed to retrieve Insider ID. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">Recover Your Insider ID</h3>
        <p className="text-gray-600 text-sm mb-6">
          Enter the email address you used to store your Insider ID.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="recovery-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Retrieving...' : 'Recover ID'}
          </button>
        </form>
      </div>
    </div>
  );
}