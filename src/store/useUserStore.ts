import { create } from 'zustand';
import { collection, query, where, getDocs, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface User {
  username: string;
  uuid: string;
  createdAt: number;
}

interface UserState {
  checkUsername: (username: string) => Promise<boolean>;
  generateUuid: (username: string) => Promise<string>;
  confirmRegistration: (uuid: string) => Promise<User | undefined>;
  getUserByUuid: (uuid: string) => Promise<User | undefined>;
}

const generateShortId = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const length = 8;
  let result = '';
  
  for (let i = 0; i < 2; i++) {
    const letterIndex = Math.floor(Math.random() * 24) + 8;
    result += chars[letterIndex];
  }
  
  for (let i = 2; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return `${result.slice(0, 4)}-${result.slice(4)}`;
};

export const useUserStore = create<UserState>(() => ({
  checkUsername: async (username: string) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },
  
  generateUuid: async (username: string) => {
    let uuid;
    do {
      uuid = generateShortId();
      const docRef = doc(db, 'users', uuid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) break;
    } while (true);
    
    // Store in pending users collection with TTL
    await setDoc(doc(db, 'pendingUsers', uuid), {
      username: username.toLowerCase(),
      uuid,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // 1 hour expiry
    });
    
    return uuid;
  },
  
  confirmRegistration: async (uuid: string) => {
    try {
      const pendingRef = doc(db, 'pendingUsers', uuid);
      const pendingSnap = await getDoc(pendingRef);
      
      if (!pendingSnap.exists()) return undefined;
      
      const pendingData = pendingSnap.data();
      
      // Create confirmed user
      const userData: User = {
        username: pendingData.username,
        uuid: uuid,
        createdAt: Date.now()
      };
      
      await setDoc(doc(db, 'users', uuid), userData);
      
      // Clean up pending registration
      await deleteDoc(pendingRef);
      
      return userData;
    } catch (error) {
      console.error('Error confirming registration:', error);
      return undefined;
    }
  },
  
  getUserByUuid: async (uuid: string) => {
    try {
      const userRef = doc(db, 'users', uuid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return undefined;
      
      const userData = userSnap.data() as User;
      return userData;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }
}));