import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth, createUserWithEmailAndPassword } from 'firebase/auth';

// Validate environment variables are loaded
const envVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


const firebaseConfig: Record<string, string | undefined> = {
  apiKey: envVars.apiKey,
  authDomain: envVars.authDomain,
  projectId: envVars.projectId,
  storageBucket: envVars.storageBucket,
  messagingSenderId: envVars.messagingSenderId,
  appId: envVars.appId
};
if (envVars.measurementId) {
  firebaseConfig.measurementId = envVars.measurementId;
}

// Validate required config values
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
if (missingFields.length > 0) {
  throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let persistenceEnabled = false;

try {
  app = initializeApp(firebaseConfig as import('firebase/app').FirebaseOptions);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Function to enable persistence safely
export const enablePersistence = async () => {
  if (persistenceEnabled) {
    return;
  }
  
  try {
    await enableIndexedDbPersistence(db);
    persistenceEnabled = true;
  } catch (err: any) {
    if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
      throw err;
    }
  }
};

// Test function to verify authentication
export const testAuth = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export { db, auth }; 