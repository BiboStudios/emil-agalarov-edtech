/**
 * FIREBASE İNTEQRASİYA MODULU (Firestore + Authentication)
 *
 * Canlı Firebase qoşmaq üçün:
 * 1. `npm install firebase`
 * 2. `.env` faylında Firebase açarlarınızı təyin edin.
 * 3. Aşağıdakı şərhi açaraq `firestoreDb` və `firebaseAuth` obyektlərini istifadə edin.
 */

/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const firebaseAuth = getAuth(app);
*/

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};
