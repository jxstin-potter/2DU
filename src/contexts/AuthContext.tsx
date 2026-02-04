import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, enablePersistence } from '../firebase';
import { User } from '../types';

// Updates that can be applied to the user profile in Firestore
export type UserProfileUpdate = Partial<Pick<User, 'name' | 'profilePicture'>>;

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (email: string, password: string, name: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (rememberMe?: boolean) => Promise<'success' | 'cancelled' | 'redirect'>;
  loginWithApple: (rememberMe?: boolean) => Promise<'success' | 'cancelled' | 'redirect'>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: UserProfileUpdate) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => 'cancelled',
  loginWithApple: async () => 'cancelled',
  logout: async () => {},
  updateUserProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const applyAuthPersistence = useCallback(async (rememberMe: boolean) => {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  }, []);

  const ensureUserDocument = useCallback(async (authUser: FirebaseUser) => {
    const userRef = doc(db, 'users', authUser.uid);
    const existing = await getDoc(userRef);
    if (existing.exists()) return;

    const userData: Omit<User, 'id'> = {
      email: (authUser.email || '').toLowerCase(),
      name: authUser.displayName || '',
      profilePicture: authUser.photoURL || undefined,
      preferences: {
        theme: 'dark',
        highContrast: false,
        notifications: true,
        defaultView: 'today',
      },
    };

    await setDoc(userRef, userData, { merge: true });
  }, []);

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
            theme: 'dark' as const,
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
              
              // If we landed here from a redirect auth flow, consume the result to surface
              // any provider errors (user state is still derived from onAuthStateChanged).
              try {
                await getRedirectResult(auth);
              } catch {
                // ignore: errors will be handled by the initiating action
              }

              // Wait before trying Firestore operations
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              try {
                await ensureUserDocument(authUser);
                const userData = await fetchUserData(authUser);
                setUser(userData);
              } catch (fetchError) {
                // If Firestore fetch fails (e.g., offline), create user from Firebase Auth data
                // This ensures the user can still use the app even if Firestore is unavailable
                const fallbackUser: User = {
                  id: authUser.uid,
                  email: authUser.email || '',
                  name: authUser.displayName || '',
                  profilePicture: authUser.photoURL || undefined,
                  preferences: {
                    theme: 'dark' as const,
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

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      setIsLoading(true);
      await applyAuthPersistence(rememberMe);
      
      // Handle the authentication (simplified - no network manipulation)
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }, [applyAuthPersistence]);

  const signup = useCallback(async (email: string, password: string, name: string, rememberMe: boolean = true) => {
    try {
      setIsLoading(true);
      await applyAuthPersistence(rememberMe);
      
      // Create user in Firebase Auth (simplified - no network manipulation)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: email.toLowerCase(),
        name: name.trim(),
        preferences: {
          theme: 'dark',
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
  }, [applyAuthPersistence]);

  const loginWithGoogle = useCallback(async (rememberMe: boolean = true): Promise<'success' | 'cancelled' | 'redirect'> => {
    try {
      setIsLoading(true);
      await applyAuthPersistence(rememberMe);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      try {
        const result = await signInWithPopup(auth, provider);
        await ensureUserDocument(result.user);
        return 'success';
      } catch (err: any) {
        // User cancelled/closed the popup -> treat as a no-op.
        if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
          return 'cancelled';
        }

        // Popup may be blocked (Safari/mobile). Fall back to redirect.
        if (err?.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return 'redirect';
        }
        throw err;
      }
    } catch (error) {
      throw new Error('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [applyAuthPersistence, ensureUserDocument]);

  const loginWithApple = useCallback(async (rememberMe: boolean = true): Promise<'success' | 'cancelled' | 'redirect'> => {
    try {
      setIsLoading(true);
      await applyAuthPersistence(rememberMe);

      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      try {
        const result = await signInWithPopup(auth, provider);
        await ensureUserDocument(result.user);
        return 'success';
      } catch (err: any) {
        if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
          return 'cancelled';
        }
        if (err?.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return 'redirect';
        }
        // This is the common case when Apple provider isn't configured in Firebase.
        if (err?.code === 'auth/operation-not-allowed') {
          throw new Error('Apple sign-in is not enabled for this project yet.');
        }
        throw err;
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Apple sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [applyAuthPersistence, ensureUserDocument]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Failed to log out');
    }
  }, []);

  const updateUserProfile = useCallback(async (updates: UserProfileUpdate) => {
    if (!firebaseUser?.uid) return;
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, updates, { merge: true });
    const updated = await fetchUserData(firebaseUser);
    setUser(updated);
  }, [firebaseUser]);

  const contextValue = useMemo(() => ({
    user,
    loading: isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    logout,
    updateUserProfile,
  }), [user, isLoading, login, signup, loginWithGoogle, loginWithApple, logout, updateUserProfile]);

  if (!isAuthReady) {
    return <div>Initializing authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 