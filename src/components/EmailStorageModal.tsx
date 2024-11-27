import React, { useState } from 'react';
import { X } from 'lucide-react';
import { storeUserEmail } from '../store/useUserStore';

interface EmailStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  uuid: string;
  username: string;
}

export default function EmailStorageModal({ isOpen, onClose, uuid, username }: EmailStorageModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await storeUserEmail(email, uuid, username);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 2000);
    } catch (err) {
      setError('Failed to store email. Please try again.');
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

        <h3 className="text-lg font-semibold mb-4">Store Your Insider ID</h3>
        <p className="text-gray-600 text-sm mb-6">
          Enter your email address to safely store your Insider ID. You can use this email to recover your ID if you forget it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
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

          {success && (
            <p className="text-green-600 text-sm">Email stored successfully!</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Storing...' : success ? 'Stored!' : 'Store Email'}
          </button>
        </form>
      </div>
    </div>
  );
}