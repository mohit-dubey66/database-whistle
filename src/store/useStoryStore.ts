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
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot
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
  views: number;
  comments: number; // Adjusted: Added 'comments' field
  createdAt: number;
}

interface StoryState {
  stories: Story[];
  loading: boolean;
  hasMore: boolean; // Adjusted: Added 'hasMore' to manage pagination state
  lastVisible: QueryDocumentSnapshot | null; // Adjusted: Added 'lastVisible' for pagination
  addStory: (story: Omit<Story, 'id' | 'timeAgo' | 'reactions' | 'views' | 'comments' | 'createdAt'>) => Promise<void>;
  toggleReaction: (storyId: string, reaction: string) => Promise<void>;
  incrementViews: (storyId: string) => Promise<void>;
  loadMoreStories: () => Promise<void>; // Adjusted: Added loadMoreStories method
  resetStories: () => void; // Adjusted: Added resetStories method
}

const STORIES_PER_PAGE = 5;

const defaultReactions = {
  'Relatable': 0,
  'I also feel this': 0,
  'Brave': 0,
  'Thought-Provoking': 0,
  'Support': 0
};

// Adjusted: Added normalizeStory utility for shared story normalization logic
const normalizeStory = (doc: QueryDocumentSnapshot): Story => {
  const data = doc.data();
  const reactions = data.reactions || defaultReactions;

  // Ensure reactions are numbers
  const normalizedReactions = Object.keys(defaultReactions).reduce((acc, key) => ({
    ...acc,
    [key]: typeof reactions[key] === 'number' ? reactions[key] : 0
  }), {});

  return {
    id: doc.id,
    ...data,
    reactions: normalizedReactions,
    views: data.views || 0,
    comments: data.comments || 0, // Added default comments handling
    timeAgo: formatRelativeTime(data.createdAt)
  } as Story;
};

export const useStoryStore = create<StoryState>((set, get) => {
  // Adjusted: Subscription setup for initial data and pagination
  const setupInitialSubscription = () => {
    const storiesQuery = query(
      collection(db, 'stories'), 
      orderBy('createdAt', 'desc'),
      limit(STORIES_PER_PAGE)
    );

    const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const stories = snapshot.docs.map(normalizeStory);

      set({ 
        stories, 
        loading: false,
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === STORIES_PER_PAGE
      });
    });

    return unsubscribe;
  };

  // Initial subscription setup
  let unsubscribe = setupInitialSubscription();

  return {
    stories: [],
    loading: true,
    hasMore: true, // Added state initialization for pagination
    lastVisible: null, // Added state initialization for pagination

    addStory: async (newStory) => {
      try {
        const storiesRef = collection(db, 'stories');
        const storyData = {
          ...newStory,
          reactions: defaultReactions,
          views: 0,
          comments: 0, // Added default comments for new stories
          createdAt: Date.now(),
          tags: []
        };

        const docRef = await addDoc(storiesRef, storyData);
        return docRef.id;
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
    },

    loadMoreStories: async () => {
      const { lastVisible, loading, hasMore, stories: existingStories } = get();

      if (loading || !hasMore || !lastVisible) return;

      set({ loading: true });

      try {
        const nextQuery = query(
          collection(db, 'stories'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(STORIES_PER_PAGE)
        );

        const snapshot = await getDocs(nextQuery);
        const newStories = snapshot.docs.map(normalizeStory);

        const existingIds = new Set(existingStories.map(story => story.id));
        const uniqueNewStories = newStories.filter(story => !existingIds.has(story.id));

        set(state => ({
          stories: [...state.stories, ...uniqueNewStories],
          lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
          hasMore: snapshot.docs.length === STORIES_PER_PAGE,
          loading: false
        }));
      } catch (error) {
        console.error('Error loading more stories:', error);
        set({ loading: false });
      }
    },

    resetStories: () => {
      if (unsubscribe) {
        unsubscribe();
      }

      set({ 
        stories: [], 
        loading: true, 
        hasMore: true, 
        lastVisible: null 
      });

      unsubscribe = setupInitialSubscription();
    }
  };
});
