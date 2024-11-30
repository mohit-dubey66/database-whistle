import React, { useState, useEffect, useCallback } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import {
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon
} from 'react-share';

interface ShareMenuProps {
  storyId: string;
  title: string;
  content: string;
  onClose: () => void;
}

export default function ShareMenu({ storyId, title, content }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Use window.location.origin to get the current domain (localhost or production)
    setShareUrl(`${window.location.origin}/story/${storyId}`);
  }, [storyId]);

  const shortContent = content.replace(/<[^>]*>/g, '').slice(0, 100) + '...';

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [shareUrl]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.share-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative share-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Share story"
      >
        <Share2 className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Share this story</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <WhatsappShareButton url={shareUrl} title={title} className="hover:opacity-80">
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>

              <LinkedinShareButton 
                url={shareUrl}
                title={title}
                summary={shortContent}
                source={window.location.hostname}
                className="hover:opacity-80"
              >
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>

              <TwitterShareButton 
                url={shareUrl}
                title={title}
                className="hover:opacity-80"
              >
                <TwitterIcon size={40} round />
              </TwitterShareButton>
            </div>

            <div className="relative">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full pr-24 pl-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="absolute right-1 top-1 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}