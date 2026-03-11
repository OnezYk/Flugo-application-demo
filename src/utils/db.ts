import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "flugo-application-db.firebaseapp.com",
  projectId: "flugo-application-db",
  storageBucket: "flugo-application-db.firebasestorage.app",
  messagingSenderId: "929864901294",
  appId: "1:929864901294:web:ab0f9b6e69f93fcfc1433f",
  measurementId: "G-M0KT2V9M38"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);