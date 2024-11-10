import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSguyP0aS4Ox_DcoQU9aR2R7-PsteVY0s",
  authDomain: "og-database-01.firebaseapp.com",
  projectId: "og-database-01",
  storageBucket: "og-database-01.firebasestorage.app",
  messagingSenderId: "399184146845",
  appId: "1:399184146845:web:d07200300b53216a1d7f74"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);