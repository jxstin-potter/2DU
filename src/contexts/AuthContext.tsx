import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, temporarilyDisableNetwork, enableNetworkAccess, enablePersistence } from '../firebase';
import { User } from '../types';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Handle fetching user data from Firestore
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      // Get user data from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // User exists in Firestore
        const userData = userDoc.data() as Omit<User, 'id'>;
        return {
          id: firebaseUser.uid,
          ...userData
        };
      } else {
        // User authenticated but no document in Firestore yet
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          preferences: {
            theme: 'light',
            highContrast: false,
            notifications: true,
            defaultView: 'today'
          }
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let authUnsubscribe: () => void;
    
    const setupAuth = async () => {
      try {
        // Enable persistence safely
        await enablePersistence();
        
        // Now listen for auth state changes
        authUnsubscribe = onAuthStateChanged(auth, async (authUser) => {
          setIsLoading(true);
          try {
            if (authUser) {
              setFirebaseUser(authUser);
              
              // Wait before trying Firestore operations
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              const userData = await fetchUserData(authUser);
              setUser(userData);
            } else {
              // User is signed out
              setFirebaseUser(null);
              setUser(null);
            }
          } catch (error) {
            console.error('Error during auth state change:', error);
            setFirebaseUser(null);
            setUser(null);
          } finally {
            setIsLoading(false);
            setIsAuthReady(true);
          }
        });
      } catch (error) {
        console.error('Error setting up auth:', error);
        setIsAuthReady(true);
        setIsLoading(false);
      }
    };
    
    setupAuth();
    
    // Cleanup subscription on unmount
    return () => {
      if (authUnsubscribe) {
        authUnsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Temporarily disable Firestore network operations to avoid race conditions
      await temporarilyDisableNetwork();
      
      // Handle the authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Wait a bit before re-enabling network
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Re-enable Firestore network access
      await enableNetworkAccess();
      
      return userCredential;
    } catch (error) {
      // Make sure to re-enable network access even on error
      try {
        await enableNetworkAccess();
      } catch (netError) {
        console.error('Error re-enabling network:', netError);
      }
      
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Temporarily disable Firestore network operations
      await temporarilyDisableNetwork();
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
      
      // Wait a bit before Firestore operations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Re-enable network for Firestore operations
      await enableNetworkAccess();
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: email.toLowerCase(),
        name: name.trim(),
        preferences: {
          theme: 'light',
          highContrast: false,
          notifications: true,
          defaultView: 'today'
        }
      };
      
      await setDoc(doc(db, 'users', authUser.uid), userData);
    } catch (error) {
      // Make sure to re-enable network access even on error
      try {
        await enableNetworkAccess();
      } catch (netError) {
        console.error('Error re-enabling network:', netError);
      }
      
      console.error('Signup error:', error);
      if (error instanceof Error && error.message.includes('already in use')) {
        throw new Error('Email already exists');
      }
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to log out');
    }
  };

  if (!isAuthReady) {
    return <div>Initializing authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 