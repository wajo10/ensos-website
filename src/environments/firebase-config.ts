import { readEnv } from './env';

export const firebaseConfig = {
  apiKey: readEnv('NG_APP_FIREBASE_API_KEY'),
  authDomain: readEnv('NG_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('NG_APP_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('NG_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('NG_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('NG_APP_FIREBASE_APP_ID'),
  measurementId: readEnv('NG_APP_FIREBASE_MEASUREMENT_ID'),
} as const;
