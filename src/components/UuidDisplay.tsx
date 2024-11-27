import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import EmailStorageModal from './EmailStorageModal';

interface UuidDisplayProps {
  uuid: string;
  username: string;
  onContinue: () => void;
}

export default function UuidDisplay({ uuid, username, onContinue }: UuidDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      const timeoutId = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      // Cleanup timeout on component unmount
      return () => window.clearTimeout(timeoutId);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [uuid]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Your Insider ID has been generated!</h3>
        <p className="text-gray-600 text-sm mb-4">
          Please save this ID carefully. You'll need it to access your username "{username}" in the future.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-lg border border-gray-200 shadow-sm">
          <code className="text-2xl font-mono tracking-wider">{uuid}</code>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-full transition-colors ${
              copied 
                ? 'bg-green-100 text-green-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>

        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Store my ID for future recovery
        </button>

      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Make sure to save this ID securely. You won't be able to recover your username without it.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        I've Saved My ID, Continue
      </button>

      <EmailStorageModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        uuid={uuid}
        username={username}
      />

    </div>
  );
}