import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple password hashing (in a real app, use a proper hashing library)
const hashPassword = (password: string): string => {
  return btoa(password); // This is just for demo purposes
};

// Create a default anonymous user
const createAnonymousUser = (): User => {
  return {
    id: 'anonymous',
    email: 'anonymous@example.com',
    password: '',
    name: 'Anonymous User',
    preferences: {
      theme: 'light',
      highContrast: false,
      notifications: true,
      defaultView: 'today'
    }
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify the user data is valid
        if (parsedUser.id && parsedUser.email && parsedUser.name) {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('user');
          // Set anonymous user
          setUser(createAnonymousUser());
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        // Set anonymous user
        setUser(createAnonymousUser());
      }
    } else {
      // No user data, set anonymous user
      setUser(createAnonymousUser());
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const hashedPassword = hashPassword(password);
    const user = storedUsers.find(
      (u: User) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = user;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const signup = async (email: string, password: string, name: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists (case-insensitive)
    if (storedUsers.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already exists');
    }

    const hashedPassword = hashPassword(password);
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(), // Store email in lowercase
      password: hashedPassword,
      name: name.trim(),
      preferences: {
        theme: 'light',
        highContrast: false,
        notifications: true,
        defaultView: 'today'
      }
    };

    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    try {
      // Set anonymous user instead of null
      const anonymousUser = createAnonymousUser();
      setUser(anonymousUser);
      localStorage.setItem('user', JSON.stringify(anonymousUser));
      
      // Clear any user-specific data
      const userId = user?.id;
      if (userId && userId !== 'anonymous') {
        localStorage.removeItem(`tasks-${userId}`);
        localStorage.removeItem(`preferences-${userId}`);
        localStorage.removeItem(`settings-${userId}`);
      }
      
      // Clear any session data
      sessionStorage.clear();
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback to setting anonymous user
      const anonymousUser = createAnonymousUser();
      setUser(anonymousUser);
      localStorage.setItem('user', JSON.stringify(anonymousUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 