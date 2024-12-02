import { create } from 'zustand';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FeedbackData {
  interfaceRating: number;
  safetyRating: number;
  reactionsRating: number;
  feedback: string;
}

interface FeedbackState {
  submitFeedback: (data: FeedbackData) => Promise<void>;
}

export const useFeedbackStore = create<FeedbackState>(() => ({
  submitFeedback: async (data: FeedbackData) => {
    try {
      const feedbackRef = collection(db, 'feedback');
      await addDoc(feedbackRef, {
        ...data,
        createdAt: Date.now(),
        userUuid: localStorage.getItem('userUuid') || 'anonymous'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}));