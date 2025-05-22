import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smart-tasks.firebaseapp.com",
  databaseURL: "https://smart-tasks-18167-default-rtdb.firebaseio.com",
  projectId: "smart-tasks",
  storageBucket: "smart-tasks-18167.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); 
export const storage = getStorage(app);