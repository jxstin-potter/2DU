import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  disableNetwork,
  enableNetwork,
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection } from 'firebase/firestore';

console.log('Firebase initialization started');

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

// Log environment variables status (without exposing values)
console.log('Environment variables status:', {
  apiKey: envVars.apiKey ? 'Present' : 'Missing',
  authDomain: envVars.authDomain ? 'Present' : 'Missing',
  projectId: envVars.projectId ? 'Present' : 'Missing',
  storageBucket: envVars.storageBucket ? 'Present' : 'Missing',
  messagingSenderId: envVars.messagingSenderId ? 'Present' : 'Missing',
  appId: envVars.appId ? 'Present' : 'Missing',
  measurementId: envVars.measurementId ? 'Present' : 'Missing'
});

const firebaseConfig = {
  apiKey: envVars.apiKey,
  authDomain: envVars.authDomain,
  projectId: envVars.projectId,
  storageBucket: envVars.storageBucket,
  messagingSenderId: envVars.messagingSenderId,
  appId: envVars.appId
};

// Validate required config values
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
if (missingFields.length > 0) {
  const error = new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  console.error('Firebase configuration error:', error);
  throw error;
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let persistenceEnabled = false;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firestore first
  db = getFirestore(app);
  console.log('Firestore database initialized successfully');

  // Initialize Authentication with additional error handling
  try {
    auth = getAuth(app);
    console.log('Firebase Authentication initialized successfully', {
      currentUser: auth.currentUser ? 'User exists' : 'No user',
      tenantId: auth.tenantId,
      settings: auth.settings,
      config: {
        apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
      }
    });
    
    // Uncomment for local testing if needed
    // if (import.meta.env.DEV) {
    //   connectAuthEmulator(auth, 'http://localhost:9099');
    //   console.log('Connected to local Auth emulator');
    // }
  } catch (authError) {
    console.error('Authentication initialization error:', authError);
    if (authError instanceof Error) {
      console.error('Auth Error details:', {
        message: authError.message,
        name: authError.name,
        stack: authError.stack,
        code: (authError as any).code
      });
    }
    throw new Error(`Failed to initialize Firebase Authentication: ${authError}`);
  }

  // Test the connection by creating a test collection
  const testCollection = collection(db, 'test');
  console.log('Test collection reference created:', testCollection);

} catch (error) {
  console.error('Error initializing Firebase:', error);
  if (error instanceof Error) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: (error as any).code
    });
  }
  throw error;
}

// Function to enable persistence safely
export const enablePersistence = async () => {
  if (persistenceEnabled) {
    console.log('Persistence already enabled');
    return;
  }
  
  try {
    await enableIndexedDbPersistence(db);
    persistenceEnabled = true;
    console.log('Offline persistence enabled');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    } else {
      console.error('Error enabling persistence:', err);
    }
  }
};

// Function to temporarily disable network access to Firestore
export const temporarilyDisableNetwork = async () => {
  try {
    await disableNetwork(db);
    console.log('Firestore network temporarily disabled');
  } catch (err) {
    console.error('Error disabling Firestore network:', err);
  }
};

// Function to re-enable network access to Firestore
export const enableNetworkAccess = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore network access re-enabled');
  } catch (err) {
    console.error('Error enabling Firestore network:', err);
  }
};

// Test function to verify authentication
export const testAuth = async (email: string, password: string) => {
  try {
    console.log('Testing authentication with:', { email });
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Authentication test successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Authentication test failed:', error);
    if (error instanceof Error) {
      console.error('Auth Test Error details:', {
        message: error.message,
        name: error.name,
        code: (error as any).code
      });
    }
    throw error;
  }
};

export { db, auth }; 