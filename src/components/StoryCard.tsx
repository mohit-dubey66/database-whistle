import React, { useState, useEffect } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import ShareMenu from './ShareMenu';
import { ChartNoAxesColumn } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import clsx from 'clsx'; //A utility for dynamically combining class names based on conditions, arrays, or objects

interface StoryProps {
  id: string;
  category: string;
  subCategory: string;
  insider: string;
  location: string;
  timeAgo: string;
  title: string;
  content: string;
  views: number; // for counting views
  selectedReaction: string | null;
  onReactionSelect: (storyId: string, reaction: string) => void;
  reactions?: { [key: string]: number };
}

const defaultReactions = {
  'Relatable': 0,
  'I also feel this': 0,
  'Brave': 0,
  'Thought-Provoking': 0,
  'Support': 0,
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
  views = 0, //initial views is 0
  reactions = defaultReactions,
}: StoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReaction = useStoryStore(state => state.toggleReaction);
  const incrementViews = useStoryStore(state => state.incrementViews);

  // Use intersection observer to track when story is in view
  const { elementRef, hasBeenViewed } = useInView({
    threshold: 0.5, // Element is considered visible when 50% is in view
  });

  // Only increment views once when the story comes into view
  useEffect(() => {
    if (hasBeenViewed) {
      incrementViews(id);
    }
  }, [hasBeenViewed, id]);

  const handleReactionClick = async (reaction: string) => {
    try {
      await toggleReaction(id, reaction);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

    // Calculate content height to determine if we need the Read More button
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [shouldShowReadMore, setShouldShowReadMore] = useState(true);
    const [contentHeight, setContentHeight] = useState(0);
  
    useEffect(() => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
        setShouldShowReadMore(height > 100);
      }
    }, [content]);

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6 max-w-full">
      <div className="flex flex-row sm:flex-row sm:justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600 font-medium break-words ">
            {category} · {subCategory}
          </div>
          <div className="text-sm text-gray-500 break-words">
            Insider: {insider} · {location}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500">{timeAgo}</span>
          <ShareMenu storyId={id} title={title} content={content} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-4 break-words">{title}</h2>

      <div className="relative">
        <div 
          ref={contentRef}
          className={clsx(
            "prose max-w-none transition-all duration-300",
            !isExpanded && "line-clamp-3"
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <div className="flex justify-end">
          {shouldShowReadMore && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium mt-1"
            >
              ...more
            </button>
          )}
        </div>
      </div>

        <div className="mt-6 space-y-4">
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

        <div className="flex items-center gap-1.5 text-gray-500 border-t pt-4">
          <ChartNoAxesColumn className="w-4 h-4" />
          <span className="text-sm font-medium">{views.toLocaleString()} views</span>
        </div>
      </div>

      {/* </div> */}
    </article>
  );
}
