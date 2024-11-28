import { create } from 'zustand';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc,
  addDoc,
  doc,
  increment,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatRelativeTime } from '../utils/timeUtils';

export interface Story {
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
  tags: { label: string }[];
  views: number;
  createdAt: number;
  // reactions: { [key: string]: number };
}

interface StoryState {
  stories: Story[];
  loading: boolean;
  addStory: (story: Omit<Story, 'id' | 'timeAgo' | 'reactions' | 'views' | 'createdAt'>) => Promise<void>;
  toggleReaction: (storyId: string, reaction: string) => Promise<void>;
  incrementViews: (storyId: string) => Promise<void>;
}

const defaultReactions = {
  'Relatable': 0,
  'I also feel this': 0,
  'Brave': 0,
  'Thought-Provoking': 0,
  'Support': 0
};

export const useStoryStore = create<StoryState>((set, get) => {
  // Subscribe to stories collection
  const storiesQuery = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
    const stories = snapshot.docs.map(doc => {
      const data = doc.data();
      const reactions = data.reactions || defaultReactions;

      // Ensure reactions are numbers
      const normalizedReactions = Object.keys(defaultReactions).reduce((acc, key) => ({
        ...acc,
        [key]: typeof reactions[key] === 'number' ? reactions[key] : 0
      }), {});

      return {
        id: doc.id,
        category: data.category,
        subCategory: data.subCategory,
        insider: data.insider,
        location: data.location,
        timeAgo: formatRelativeTime(data.createdAt),
        title: data.title,
        content: data.content,
        tags: data.tags,
        views: data.views || 0,
        createdAt: data.createdAt,
        reactions: normalizedReactions
      };
    }) as Story[];
    set({ stories, loading: false });
  });

  return {
    stories: [],
    loading: true,

    addStory: async (newStory) => {
      try {
        await addDoc(collection(db, 'stories'), {
          ...newStory,
          reactions: defaultReactions,
          views: 0,
          createdAt: Date.now()
        });
      } catch (error) {
        console.error('Error adding story:', error);
        throw error;
      }
    },

    toggleReaction: async (storyId: string, reaction: string) => {
      try {
        const storyRef = doc(db, 'stories', storyId);
        const story = get().stories.find(s => s.id === storyId);
        
        if (!story) return;

        const currentCount = story.reactions[reaction] || 0;
        
        await updateDoc(storyRef, {
          [`reactions.${reaction}`]: currentCount + 1
        });
      } catch (error) {
        console.error('Error toggling reaction:', error);
        throw error;
      }
    },

    incrementViews: async (storyId: string) => {
      try {
        const storyRef = doc(db, 'stories', storyId);
        await updateDoc(storyRef, {
          views: increment(1)
        });
      } catch (error) {
        console.error('Error incrementing views:', error);
        throw error;
      }
    }

  };
});