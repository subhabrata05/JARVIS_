import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: "jarvis-6ef86",
  appId: "1:468789882376:web:4af8a262f9708a7d42abbd",
  storageBucket: "jarvis-6ef86.firebasestorage.app",
  apiKey: "AIzaSyCJOJHH6Xxi7Ld9oXCbW056iIQsYA1AXZM",
  authDomain: "jarvis-6ef86.firebaseapp.com",
  messagingSenderId: "468789882376",
  measurementId: "G-Z6E825BSQ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, googleProvider, appleProvider };
