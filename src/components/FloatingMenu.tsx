import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Heart, MessageSquare, Star, X } from 'lucide-react';
import clsx from 'clsx';

interface MenuOption {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
}

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.floating-menu')) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const menuOptions: MenuOption[] = [
    {
      icon: Heart,
      label: 'Donate',
      description: 'Support freedom of speech',
      onClick: () => window.open('#', '_blank')
    },
    {
      icon: Star,
      label: 'Feature Requests',
      description: 'Suggest new features',
      onClick: () => window.open('#', '_blank')
    },
    {
      icon: MessageSquare,
      label: 'Feedback',
      description: 'Share your thoughts',
      onClick: () => window.open('#', '_blank')
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 floating-menu">
      {/* Menu Items */}
      <div
        className={clsx(
          'absolute bottom-full right-0 mb-4 min-w-[280px] transition-all duration-300 ease-in-out',
          isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          {menuOptions.map((option, index) => (
            <button
              key={option.label}
              onClick={(e) => {
                e.stopPropagation();
                option.onClick();
                setIsOpen(false);
              }}
              className={clsx(
                'w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors',
                index !== menuOptions.length - 1 && 'border-b border-gray-100'
              )}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <option.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={clsx(
          'w-14 h-14 rounded-full bg-black text-white shadow-lg',
          'flex items-center justify-center transition-transform duration-300',
          'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
          isOpen && 'rotate-45'
        )}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <ChefHat className="w-6 h-6" />
      </button>

      {/* Help Text */}
      <div
        className={clsx(
          'absolute bottom-0 right-full mr-4 transition-all duration-200',
          isOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
        )}
      >
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">Help us cook something new!</p>
        </div>
      </div>
    </div>
  );
}