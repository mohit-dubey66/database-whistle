import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, MessageSquarePlus, Gift, Heart } from 'lucide-react';

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.floating-menu-container')) {
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

  const menuItems = [
    {
      label: 'Feedback',
      icon: MessageSquarePlus,
      onClick: () => window.open('#', '_blank')
    },
    // {
    //   label: 'Category/Topic Request',
    //   icon: ChefHat,
    //   onClick: () => window.open('#', '_blank')
    // },
    {
      label: 'Feature Request',
      icon: Gift,
      onClick: () => window.open('#', '_blank')
    },
    {
      label: 'Donate ',
      icon: Heart,
      onClick: () => window.open('#', '_blank')
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
      <div className="relative">
        {/* Menu Items */}
        <div
          className={`absolute bottom-full right-0 mb-4 transition-all duration-200 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex flex-col-reverse gap-3 items-end py-3 rounded w-[12rem] border-gray-400 bg-zinc-100 border border-solid">
            {menuItems.map((item,index) => (
              <button
                key={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2   border-b-[1px]  ${index == menuItems.length-1 ? "none" : "border-zinc-300"  } w-full  hover:bg-gray-50 transition-colors group`}
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
                {/* <item.icon className="w-[30px] h-5 text-gray-600 group-hover:text-gray-900" /> */}
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
          className={`w-14 h-14 rounded-full bg-black text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          <ChefHat className="w-6 h-6" />
        </button>

        {/* Help Text */}
        <div
          className={`absolute bottom-0 right-full mr-4 whitespace-nowrap transition-all duration-200 ${
            isOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
          }`}
        >
          {/* <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
            <p className="text-sm font-medium text-gray-900">Help us cook something new!</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}