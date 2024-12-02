import { create } from 'zustand';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FeatureFormData {
  title: string;
  description: string;
}

interface CategoryFormData {
  category: string;
  topic: string;
  remark: string;
}

interface FeatureRequest {
  type: 'feature';
  data: FeatureFormData;
}

interface CategoryRequest {
  type: 'category';
  data: CategoryFormData;
}

type Request = FeatureRequest | CategoryRequest;

interface FeatureRequestState {
  submitRequest: (request: Request) => Promise<void>;
}

export const useFeatureRequestStore = create<FeatureRequestState>(() => ({
  submitRequest: async (request: Request) => {
    try {
      const requestsRef = collection(db, 'featureRequests');
      await addDoc(requestsRef, {
        ...request,
        createdAt: Date.now(),
        userUuid: localStorage.getItem('userUuid') || 'anonymous',
        status: 'pending'
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
  }
}));