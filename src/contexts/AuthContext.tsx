import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  linkWithCredential,
  EmailAuthProvider,
  updatePassword,
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
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, enablePersistence } from '../firebase';
import { User } from '../types';
import { logger } from '../utils/logger';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const mapAuthError = (error: unknown, fallback: string) => {
  // Firebase errors typically have a `code` like: auth/wrong-password
  const code = (error as any)?.code as string | undefined;
  switch (code) {
    case 'auth/invalid-email':
      return new Error('Please enter a valid email address.');
    case 'auth/user-disabled':
      return new Error('This account has been disabled.');
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return new Error('Invalid email or password.');
    case 'auth/too-many-requests':
      return new Error('Too many attempts. Please try again later.');
    case 'auth/network-request-failed':
      return new Error('Network error. Check your connection and try again.');
    case 'auth/operation-not-allowed':
      return new Error('Email/password sign-in is not enabled for this project.');
    case 'auth/account-exists-with-different-credential':
      return new Error('This email is linked to a different sign-in method (e.g. Google). Use that method or reset your password if applicable.');
    case 'auth/requires-recent-login':
      return new Error('For security, please sign in again and retry this action.');
    case 'auth/weak-password':
      return new Error('Password is too weak. Use at least 6 characters.');
    default:
      return error instanceof Error ? error : new Error(fallback);
  }
};

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
  requestPasswordReset: (email: string) => Promise<void>;
  addPassword: (newPassword: string) => Promise<void>;
  authProviders: string[];
  hasPasswordProvider: boolean;
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
  requestPasswordReset: async () => {},
  addPassword: async () => {},
  authProviders: [],
  hasPasswordProvider: false,
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
      email: normalizeEmail(authUser.email || ''),
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
      logger.error('Error fetching user data', { action: 'fetchUserData' }, error);
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
  }, [ensureUserDocument]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      setIsLoading(true);
      await applyAuthPersistence(rememberMe);
      
      // Handle the authentication (simplified - no network manipulation)
      await signInWithEmailAndPassword(auth, normalizeEmail(email), password);
    } catch (error) {
      throw mapAuthError(error, 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [applyAuthPersistence]);

  const signup = useCallback(async (email: string, password: string, name: string, rememberMe: boolean = true) => {
    try {
      setIsLoading(true);
      await applyAuthPersistence(rememberMe);
      
      // Create user in Firebase Auth (simplified - no network manipulation)
      const normalizedEmail = normalizeEmail(email);
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const authUser = userCredential.user;
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: normalizedEmail,
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
      throw mapAuthError(error, 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  }, [applyAuthPersistence]);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, normalizeEmail(email));
    } catch (error) {
      const code = (error as any)?.code as string | undefined;
      // Avoid account enumeration: treat "user not found" as success.
      if (code === 'auth/user-not-found') return;
      throw mapAuthError(error, 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authProviders = useMemo(() => {
    const providers = (firebaseUser?.providerData || [])
      .map(p => p?.providerId)
      .filter((p): p is string => Boolean(p));
    return Array.from(new Set(providers));
  }, [firebaseUser?.providerData]);

  const hasPasswordProvider = authProviders.includes('password');

  const addPassword = useCallback(async (newPassword: string) => {
    const current = auth.currentUser;
    if (!current) throw new Error('You must be signed in to add a password.');
    const email = current.email ? normalizeEmail(current.email) : '';
    if (!email) throw new Error('No email found for your account.');

    try {
      setIsLoading(true);
      if (current.providerData?.some(p => p.providerId === 'password')) {
        // Account already has a password -> treat as change password.
        await updatePassword(current, newPassword);
        return;
      }

      const credential = EmailAuthProvider.credential(email, newPassword);
      await linkWithCredential(current, credential);
    } catch (error) {
      throw mapAuthError(error, 'Failed to add password.');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    requestPasswordReset,
    addPassword,
    authProviders,
    hasPasswordProvider,
  }), [
    user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    logout,
    updateUserProfile,
    requestPasswordReset,
    addPassword,
    authProviders,
    hasPasswordProvider,
  ]);

  if (!isAuthReady) {
    return <div>Initializing authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 