import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useI18n } from './I18nContext';

// Define the context type
interface A11yContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  focusVisible: boolean;
  toggleFocusVisible: () => void;
  screenReaderOnly: boolean;
  toggleScreenReaderOnly: () => void;
}

// Create the context with a default value
const A11yContext = createContext<A11yContextType>({
  highContrast: false,
  toggleHighContrast: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
  fontSize: 16,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  resetFontSize: () => {},
  focusVisible: false,
  toggleFocusVisible: () => {},
  screenReaderOnly: false,
  toggleScreenReaderOnly: () => {},
});

// Create a provider component
interface A11yProviderProps {
  children: ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const { t: _t } = useI18n();
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [focusVisible, setFocusVisible] = useState<boolean>(false);
  const [screenReaderOnly, setScreenReaderOnly] = useState<boolean>(false);

  // Apply high contrast mode
  const applyHighContrast = useCallback((value: boolean) => {
    if (value) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, []);

  // Toggle high contrast mode
  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const newValue = !prev;
      localStorage.setItem('highContrast', newValue.toString());
      applyHighContrast(newValue);
      return newValue;
    });
  }, [applyHighContrast]);

  // Apply reduced motion
  const applyReducedMotion = useCallback((value: boolean) => {
    if (value) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, []);

  // Toggle reduced motion
  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => {
      const newValue = !prev;
      localStorage.setItem('reducedMotion', newValue.toString());
      applyReducedMotion(newValue);
      return newValue;
    });
  }, [applyReducedMotion]);

  // Apply font size - use CSS custom property to prevent layout thrashing
  // This triggers a repaint but not a full layout recalculation
  const applyFontSize = useCallback((size: number) => {
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
    // Note: body font-size is set via CSS variable in global.css, no direct manipulation needed
  }, []);

  // Increase font size
  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const newSize = Math.min(prev + 2, 24);
      localStorage.setItem('fontSize', newSize.toString());
      applyFontSize(newSize);
      return newSize;
    });
  }, [applyFontSize]);

  // Decrease font size
  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const newSize = Math.max(prev - 2, 12);
      localStorage.setItem('fontSize', newSize.toString());
      applyFontSize(newSize);
      return newSize;
    });
  }, [applyFontSize]);

  // Reset font size
  const resetFontSize = useCallback(() => {
    const defaultSize = 16;
    setFontSize(defaultSize);
    localStorage.setItem('fontSize', defaultSize.toString());
    applyFontSize(defaultSize);
  }, [applyFontSize]);

  // Apply focus visible
  const applyFocusVisible = useCallback((value: boolean) => {
    if (value) {
      document.documentElement.classList.add('focus-visible');
    } else {
      document.documentElement.classList.remove('focus-visible');
    }
  }, []);

  // Toggle focus visible
  const toggleFocusVisible = useCallback(() => {
    setFocusVisible((prev) => {
      const newValue = !prev;
      localStorage.setItem('focusVisible', newValue.toString());
      applyFocusVisible(newValue);
      return newValue;
    });
  }, [applyFocusVisible]);

  // Apply screen reader only
  const applyScreenReaderOnly = useCallback((value: boolean) => {
    if (value) {
      document.documentElement.classList.add('screen-reader-only');
    } else {
      document.documentElement.classList.remove('screen-reader-only');
    }
  }, []);

  // Toggle screen reader only
  const toggleScreenReaderOnly = useCallback(() => {
    setScreenReaderOnly((prev) => {
      const newValue = !prev;
      localStorage.setItem('screenReaderOnly', newValue.toString());
      applyScreenReaderOnly(newValue);
      return newValue;
    });
  }, [applyScreenReaderOnly]);

  // Initialize accessibility settings from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '16', 10);
    const savedFocusVisible = localStorage.getItem('focusVisible') === 'true';
    const savedScreenReaderOnly = localStorage.getItem('screenReaderOnly') === 'true';

    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setFontSize(savedFontSize);
    setFocusVisible(savedFocusVisible);
    setScreenReaderOnly(savedScreenReaderOnly);

    // Apply initial settings
    applyHighContrast(savedHighContrast);
    applyReducedMotion(savedReducedMotion);
    applyFontSize(savedFontSize);
    applyFocusVisible(savedFocusVisible);
    applyScreenReaderOnly(savedScreenReaderOnly);
  }, [
    applyFocusVisible,
    applyFontSize,
    applyHighContrast,
    applyReducedMotion,
    applyScreenReaderOnly,
  ]);

  // Create the context value - memoize to prevent unnecessary re-renders
  const contextValue: A11yContextType = useMemo(() => ({
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    focusVisible,
    toggleFocusVisible,
    screenReaderOnly,
    toggleScreenReaderOnly,
  }), [
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    focusVisible,
    toggleFocusVisible,
    screenReaderOnly,
    toggleScreenReaderOnly,
  ]);

  return <A11yContext.Provider value={contextValue}>{children}</A11yContext.Provider>;
};

// Create a custom hook to use the context
export const useA11y = () => useContext(A11yContext);

export default A11yContext; 