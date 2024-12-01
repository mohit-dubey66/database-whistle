import React, { useState, useMemo, useEffect, useCallback } from 'react';
import TagList from '../components/TagList';
import StoryCard from '../components/StoryCard';
import Header from '../components/Header';
import FloatingMenu from '../components/FloatingMenu';
import { useStoryStore } from '../store/useStoryStore';

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storyReactions, setStoryReactions] = useState<Record<string, string | null>>({});
  
  const { 
    stories, 
    loading, 
    hasMore, 
    loadMoreStories,
    resetStories 
  } = useStoryStore();

  // Reset stories when tag changes
  useEffect(() => {
    resetStories();
  }, [selectedTag]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleReactionSelect = (storyId: string, reaction: string) => {
    setStoryReactions(prev => ({
      ...prev,
      [storyId]: prev[storyId] === reaction ? null : reaction
    }));
  };

  const filteredStories = useMemo(() => {
    let filtered = stories;
  
    if (selectedTag) {
      filtered = filtered.filter(story => story.subCategory === selectedTag);
    }
  
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query) ||
        story.insider.toLowerCase().includes(query) ||
        story.location.toLowerCase().includes(query) ||
        story.subCategory.toLowerCase().includes(query) ||
        (story.tags && story.tags.some(tag => tag.label.toLowerCase().includes(query)))  // Ensure story.tags exists
      );
    }

    // Ensure no duplicate stories by using a Map with story ID as key
    const uniqueStories = Array.from(
      new Map(filtered.map(story => [story.id, story])).values()
    );
  
    return uniqueStories;
  }, [selectedTag, searchQuery, stories]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
      if (loading || !hasMore) return;
  
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000;
  
      if (scrolledToBottom) {
        loadMoreStories();
      }
    }, [loading, hasMore, loadMoreStories]);
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);
  

  return (
    <>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Make TagList horizontally scrollable on mobile */}
      <div className="overflow-x-auto px-2 mb-4">
        <TagList selectedTag={selectedTag} onTagSelect={handleTagSelect} />
      </div>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredStories.map(story => (
          <StoryCard
            key={story.id}
            {...story}
            selectedReaction={typeof storyReactions[story.id] === 'string' ? storyReactions[story.id] : null}
            onReactionSelect={handleReactionSelect}
          />
        ))}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery.trim()
                ? 'No stories found matching your search criteria.'
                : 'No stories found for this tag.'}
            </p>
          </div>
        )}
        
        {!loading && !hasMore && filteredStories.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            You've reached the end
          </div>
        )}
      </main>
      <FloatingMenu />
    </>
  );
}
