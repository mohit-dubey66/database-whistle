import { create } from 'zustand';  // Imports Zustand's create function for state management
import { collection, query, where, getDocs, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';  // Firebase Firestore functions
import { db } from '../lib/firebase';  // Firebase database instance

interface User {
  username: string;  // User's username
  uuid: string;      // Unique identifier
  createdAt: number; // Timestamp of creation
}

interface UserState {
  // Function definitions for user management operations
  checkUsername: (username: string) => Promise<boolean>;
  generateUuid: (username: string) => Promise<string>;
  confirmRegistration: (uuid: string) => Promise<User | undefined>;
  getUserByUuid: (uuid: string) => Promise<User | undefined>;
}

const generateShortId = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Character set for ID generation
  const length = 8; // Total length of ID
  let result = '';
  
  // First 2 characters are guaranteed to be letters (indices 8-31 are letters)
  for (let i = 0; i < 2; i++) {
    const letterIndex = Math.floor(Math.random() * 24) + 8;
    result += chars[letterIndex];
  }
  
  // Remaining 6 characters can be any character from the set
  for (let i = 2; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  // Returns format: XXXX-XXXX
  return `${result.slice(0, 4)}-${result.slice(4)}`;
};

export const useUserStore = create<UserState>(() => ({
  // Check if username exists
  checkUsername: async (username: string) => {
    try {
      const usersRef = collection(db, 'users'); // Reference to users collection
      const q = query(usersRef, where('username', '==', username.toLowerCase())); // Query for username
      const querySnapshot = await getDocs(q); // Query for username
      return !querySnapshot.empty; // Returns true if username exists
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },
  
  // Generate unique ID for new user
  generateUuid: async (username: string) => {
    let uuid;
    // Keep generating IDs until an unused one is found
    do {
      uuid = generateShortId();
      const docRef = doc(db, 'users', uuid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) break;
    } while (true);
    
    // Store in pending users collection with TTL
    // Create temporary user record
    await setDoc(doc(db, 'pendingUsers', uuid), {
      username: username.toLowerCase(),
      uuid,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // Expires in 1 hour
    });
    
    return uuid;
  },
  
  // Confirm user registration
  confirmRegistration: async (uuid: string) => {
    try {
      const pendingRef = doc(db, 'pendingUsers', uuid);
      const pendingSnap = await getDoc(pendingRef);
      
      if (!pendingSnap.exists()) return undefined;
      
      const pendingData = pendingSnap.data();
      
      // Create permanent user record
      const userData: User = {
        username: pendingData.username,
        uuid: uuid,
        createdAt: Date.now()
      };
      
      await setDoc(doc(db, 'users', uuid), userData); // Save to users collection
      await deleteDoc(pendingRef); // Remove pending registration
      
      return userData;
    } catch (error) {
      console.error('Error confirming registration:', error);
      return undefined;
    }
  },
  
  // Fetch user by UUID
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