import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // App-wide decision: always-dark theme for consistent black/gold brand styling.
  // We keep the context shape stable, but `toggleColorMode` is intentionally a no-op.
  const [mode] = useState<ThemeMode>('dark');

  const toggleColorMode = useCallback(() => {
    // no-op: theme mode is fixed
  }, []);

  const contextValue = useMemo(() => ({
    mode,
    toggleColorMode,
  }), [mode, toggleColorMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 