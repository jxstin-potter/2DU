import React, { ReactNode } from 'react';
type ThemeMode = 'light' | 'dark';
interface ThemeContextType {
    mode: ThemeMode;
    toggleColorMode: () => void;
}
export declare const ThemeProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
