import React from 'react';

interface TagListProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const tags = [
  'Feed',
  'Overwork',
  'College',
  'Placements',
  'Faculty',
  'Healthcare Failure',
  'WorkPressure',
  'Government',
  'Public Infrastructure',
  'Judicial Misconduct',
  
];

export default function TagList({ selectedTag, onTagSelect }: TagListProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      {/* Make the tag list horizontally scrollable */}
      <div className="py-4 flex overflow-x-auto gap-2 whitespace-nowrap ">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag === 'Feed' ? null : selectedTag === tag ? null : tag)}
            className={`flex-none px-4 py-1.5 rounded-lg text-sm transition-colors ${
              (tag === 'Feed' && !selectedTag) || selectedTag === tag
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tag === 'Feed' ? tag : `#${tag}`}
          </button>
        ))}
      </div>
    </div>
  );
}
