import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  const navigate = useNavigate();

  const handleAddStory = () => {
    const userUuid = localStorage.getItem('userUuid');
    if (userUuid) {
      navigate('/create-story', { state: { anonymousId: userUuid } });
    } else {
      navigate('/claim-identity');
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              whistleblower
            </Link>
          </div>
          
          {onSearchChange && (
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by title, company, location, or tags..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAddStory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Your Story
          </button>
        </div>
      </div>
    </header>
  );
}