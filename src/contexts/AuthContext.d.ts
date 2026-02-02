import React from 'react';
import { User } from '../types';
export type UserProfileUpdate = Partial<Pick<User, 'name' | 'profilePicture'>>;
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (updates: UserProfileUpdate) => Promise<void>;
}
export declare const useAuth: () => AuthContextType;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
