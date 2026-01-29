export interface User {
    id: string;
    email: string;
    name: string;
    profilePicture?: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    highContrast: boolean;
    notifications: boolean;
    defaultView: 'today' | 'upcoming' | 'calendar' | 'tags';
}
export interface SharedUser {
    userId: string;
    email: string;
    role: 'viewer' | 'editor';
    sharedAt: Date;
}
