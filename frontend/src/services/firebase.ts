import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDnHrDKpfuEqxzvnaYT7EeZanjDwmE0VUc",
  authDomain: "jobconnect-70a73.firebaseapp.com",
  projectId: "jobconnect-70a73",
  storageBucket: "jobconnect-70a73.firebasestorage.app",
  messagingSenderId: "497775861848",
  appId: "1:497775861848:web:e045a9e6a9d6565e746a2d",
  measurementId: "G-2EGYMGTRKJ"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export { RecaptchaVerifier, signInWithPhoneNumber };
export type { ConfirmationResult };
