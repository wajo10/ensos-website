export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyD-LlcQLYYecgafYjIS9XQCEeaWDe_0uIw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'enso-restaurante.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'enso-restaurante',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'enso-restaurante.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '871441947825',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:871441947825:web:788c7d27d06944dc621690',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-2HZMPDPTWT',
} as const;
