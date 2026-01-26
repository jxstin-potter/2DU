import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, enablePersistence } from '../firebase';
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
            theme: 'light' as const,
            highContrast: false,
            notifications: true,
            defaultView: 'today' as const
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
        // Enable persistence (simplified - let it fail gracefully if already enabled)
        try {
          await enablePersistence();
        } catch (persistError) {
          // Persistence may already be enabled, ignore error
        }
        
        // Now listen for auth state changes
        authUnsubscribe = onAuthStateChanged(auth, async (authUser) => {
          setIsLoading(true);
          try {
            if (authUser) {
              setFirebaseUser(authUser);
              
              // Wait before trying Firestore operations
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              try {
                const userData = await fetchUserData(authUser);
                setUser(userData);
              } catch (fetchError) {
                // If Firestore fetch fails (e.g., offline), create user from Firebase Auth data
                // This ensures the user can still use the app even if Firestore is unavailable
                const fallbackUser: User = {
                  id: authUser.uid,
                  email: authUser.email || '',
                  name: authUser.displayName || '',
                  preferences: {
                    theme: 'light' as const,
                    highContrast: false,
                    notifications: true,
                    defaultView: 'today' as const
                  }
                };
                setUser(fallbackUser);
              }
            } else {
              // User is signed out
              setFirebaseUser(null);
              setUser(null);
            }
          } catch (error) {
            // Only clear user if we don't have a valid authUser
            if (!authUser) {
              setFirebaseUser(null);
              setUser(null);
            }
          } finally {
            setIsLoading(false);
            setIsAuthReady(true);
          }
        });
      } catch (error) {
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

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Handle the authentication (simplified - no network manipulation)
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Create user in Firebase Auth (simplified - no network manipulation)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
      
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
      if (error instanceof Error && error.message.includes('already in use')) {
        throw new Error('Email already exists');
      }
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Failed to log out');
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading: isLoading,
    login,
    signup,
    logout,
  }), [user, isLoading, login, signup, logout]);

  if (!isAuthReady) {
    return <div>Initializing authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 