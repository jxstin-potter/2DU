import React, { ReactNode } from 'react';
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
declare const A11yContext: React.Context<A11yContextType>;
interface A11yProviderProps {
    children: ReactNode;
}
export declare const A11yProvider: React.FC<A11yProviderProps>;
export declare const useA11y: () => A11yContextType;
export default A11yContext;
