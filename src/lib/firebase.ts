import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBa7zLmZag9e59uIcmWNI-ukGTKV0oh-84",
    authDomain: "jobconnect-2b92a.firebaseapp.com",
    projectId: "jobconnect-2b92a",
    storageBucket: "jobconnect-2b92a.firebasestorage.app",
    messagingSenderId: "420210302537",
    appId: "1:420210302537:web:76bff8f35893a1507ee998",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;