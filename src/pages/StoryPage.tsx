import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import StoryCard from '../components/StoryCard';
import { useStoryStore } from '../store/useStoryStore';
import type { Story } from '../store/useStoryStore';

export default function StoryPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const stories = useStoryStore((state) => state.stories);

  useEffect(() => {
    const currentStory = stories.find(s => s.id === storyId);
    if (currentStory) {
      setStory(currentStory);
      // Update meta tags dynamically
      document.title = `${currentStory.title} - Whistleblower Club`;
      updateMetaTags(currentStory);
    }
  }, [storyId, stories]);

  const updateMetaTags = (story: Story) => {
    const description = story.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
    
    // Update OpenGraph tags
    updateMetaTag('og:title', story.title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', window.location.href);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', story.title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:url', window.location.href);
  };

  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Story not found</h2>
            <p className="mt-2 text-gray-600">The story you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
        <StoryCard {...story} />
      </main>
    </div>
  );
}