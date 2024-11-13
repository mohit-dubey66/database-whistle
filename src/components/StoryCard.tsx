import React from 'react';
import { useStoryStore } from '../store/useStoryStore';
import ShareMenu from './ShareMenu';

interface StoryProps {
  id: string;
  category: string;
  subCategory: string;
  insider: string;
  location: string;
  timeAgo: string;
  title: string;
  content: string;
  reactions: {
    [key: string]: number;
  };
  selectedReaction: string | null;
  onReactionSelect: (storyId: string, reaction: string) => void;
}

const defaultReactions = {
  'Relatable': 0,
  'I also feel this': 0,
  'Brave': 0,
  'Thought-Provoking': 0,
  'Support': 0
};

export default function StoryCard({
  id,
  category,
  subCategory,
  insider,
  location,
  timeAgo,
  title,
  content,
  reactions = defaultReactions,
}: StoryProps) {
  const toggleReaction = useStoryStore(state => state.toggleReaction);

  const handleReactionClick = async (reaction: string) => {
    try {
      await toggleReaction(id, reaction);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm text-gray-600">
            {category} · {subCategory}
          </div>
          <div className="text-sm text-gray-500">
            Insider: {insider} · {location}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{timeAgo}</span>
          <ShareMenu storyId={id} title={title} content={content} />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div 
        className="text-gray-700 mb-6 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="flex flex-wrap gap-2">
        {Object.entries(defaultReactions).map(([reactionType]) => (
          <button
            key={reactionType}
            onClick={() => handleReactionClick(reactionType)}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {reactionType}
            <span className="ml-2">{reactions[reactionType] || 0}</span>
          </button>
        ))}
      </div>
    </article>
  );
}