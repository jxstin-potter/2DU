import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Language, setLanguage, getLanguage, initLanguage, t, formatDate, formatRelativeDate, formatDistanceDate, formatNumber, formatCurrency } from '../utils/i18n';

// Define the context type
interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  formatDate: (date: Date | string, formatStr?: string) => string;
  formatRelativeDate: (date: Date | string, baseDate?: Date) => string;
  formatDistanceDate: (date: Date | string, baseDate?: Date) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

// Create the context with a default value
const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  formatDate: (date: Date | string) => date.toString(),
  formatRelativeDate: (date: Date | string) => date.toString(),
  formatDistanceDate: (date: Date | string) => date.toString(),
  formatNumber: (number: number) => number.toString(),
  formatCurrency: (amount: number) => amount.toString(),
});

// Create a provider component
interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getLanguage());

  // Initialize language on mount
  useEffect(() => {
    initLanguage();
    const currentLang = getLanguage();
    setLanguageState(currentLang);
  }, []);

  // Handle language change
  const handleSetLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setLanguageState(newLanguage);
  }, []);

  // Create the context value - memoize to prevent unnecessary re-renders
  // Note: t, formatDate, etc. are imported functions that are stable, so they don't need memoization
  const contextValue: I18nContextType = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t,
    formatDate,
    formatRelativeDate,
    formatDistanceDate,
    formatNumber,
    formatCurrency,
  }), [language, handleSetLanguage]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

// Create a custom hook to use the context
export const useI18n = () => useContext(I18nContext);

export default I18nContext; 