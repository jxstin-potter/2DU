import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useI18n } from './I18nContext';
// Create the context with a default value
var A11yContext = createContext({
    highContrast: false,
    toggleHighContrast: function () { },
    reducedMotion: false,
    toggleReducedMotion: function () { },
    fontSize: 16,
    increaseFontSize: function () { },
    decreaseFontSize: function () { },
    resetFontSize: function () { },
    focusVisible: false,
    toggleFocusVisible: function () { },
    screenReaderOnly: false,
    toggleScreenReaderOnly: function () { },
});
export var A11yProvider = function (_a) {
    var children = _a.children;
    var t = useI18n().t;
    var _b = useState(false), highContrast = _b[0], setHighContrast = _b[1];
    var _c = useState(false), reducedMotion = _c[0], setReducedMotion = _c[1];
    var _d = useState(16), fontSize = _d[0], setFontSize = _d[1];
    var _e = useState(false), focusVisible = _e[0], setFocusVisible = _e[1];
    var _f = useState(false), screenReaderOnly = _f[0], setScreenReaderOnly = _f[1];
    // Initialize accessibility settings from localStorage
    useEffect(function () {
        var savedHighContrast = localStorage.getItem('highContrast') === 'true';
        var savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
        var savedFontSize = parseInt(localStorage.getItem('fontSize') || '16', 10);
        var savedFocusVisible = localStorage.getItem('focusVisible') === 'true';
        var savedScreenReaderOnly = localStorage.getItem('screenReaderOnly') === 'true';
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
    }, []);
    // Apply high contrast mode
    var applyHighContrast = useCallback(function (value) {
        if (value) {
            document.documentElement.classList.add('high-contrast');
        }
        else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, []);
    // Toggle high contrast mode
    var toggleHighContrast = useCallback(function () {
        setHighContrast(function (prev) {
            var newValue = !prev;
            localStorage.setItem('highContrast', newValue.toString());
            applyHighContrast(newValue);
            return newValue;
        });
    }, [applyHighContrast]);
    // Apply reduced motion
    var applyReducedMotion = useCallback(function (value) {
        if (value) {
            document.documentElement.classList.add('reduced-motion');
        }
        else {
            document.documentElement.classList.remove('reduced-motion');
        }
    }, []);
    // Toggle reduced motion
    var toggleReducedMotion = useCallback(function () {
        setReducedMotion(function (prev) {
            var newValue = !prev;
            localStorage.setItem('reducedMotion', newValue.toString());
            applyReducedMotion(newValue);
            return newValue;
        });
    }, [applyReducedMotion]);
    // Apply font size - use CSS custom property to prevent layout thrashing
    // This triggers a repaint but not a full layout recalculation
    var applyFontSize = useCallback(function (size) {
        document.documentElement.style.setProperty('--base-font-size', "".concat(size, "px"));
        // Note: body font-size is set via CSS variable in global.css, no direct manipulation needed
    }, []);
    // Increase font size
    var increaseFontSize = useCallback(function () {
        setFontSize(function (prev) {
            var newSize = Math.min(prev + 2, 24);
            localStorage.setItem('fontSize', newSize.toString());
            applyFontSize(newSize);
            return newSize;
        });
    }, [applyFontSize]);
    // Decrease font size
    var decreaseFontSize = useCallback(function () {
        setFontSize(function (prev) {
            var newSize = Math.max(prev - 2, 12);
            localStorage.setItem('fontSize', newSize.toString());
            applyFontSize(newSize);
            return newSize;
        });
    }, [applyFontSize]);
    // Reset font size
    var resetFontSize = useCallback(function () {
        var defaultSize = 16;
        setFontSize(defaultSize);
        localStorage.setItem('fontSize', defaultSize.toString());
        applyFontSize(defaultSize);
    }, [applyFontSize]);
    // Apply focus visible
    var applyFocusVisible = useCallback(function (value) {
        if (value) {
            document.documentElement.classList.add('focus-visible');
        }
        else {
            document.documentElement.classList.remove('focus-visible');
        }
    }, []);
    // Toggle focus visible
    var toggleFocusVisible = useCallback(function () {
        setFocusVisible(function (prev) {
            var newValue = !prev;
            localStorage.setItem('focusVisible', newValue.toString());
            applyFocusVisible(newValue);
            return newValue;
        });
    }, [applyFocusVisible]);
    // Apply screen reader only
    var applyScreenReaderOnly = useCallback(function (value) {
        if (value) {
            document.documentElement.classList.add('screen-reader-only');
        }
        else {
            document.documentElement.classList.remove('screen-reader-only');
        }
    }, []);
    // Toggle screen reader only
    var toggleScreenReaderOnly = useCallback(function () {
        setScreenReaderOnly(function (prev) {
            var newValue = !prev;
            localStorage.setItem('screenReaderOnly', newValue.toString());
            applyScreenReaderOnly(newValue);
            return newValue;
        });
    }, [applyScreenReaderOnly]);
    // Create the context value - memoize to prevent unnecessary re-renders
    var contextValue = useMemo(function () { return ({
        highContrast: highContrast,
        toggleHighContrast: toggleHighContrast,
        reducedMotion: reducedMotion,
        toggleReducedMotion: toggleReducedMotion,
        fontSize: fontSize,
        increaseFontSize: increaseFontSize,
        decreaseFontSize: decreaseFontSize,
        resetFontSize: resetFontSize,
        focusVisible: focusVisible,
        toggleFocusVisible: toggleFocusVisible,
        screenReaderOnly: screenReaderOnly,
        toggleScreenReaderOnly: toggleScreenReaderOnly,
    }); }, [
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
    return _jsx(A11yContext.Provider, { value: contextValue, children: children });
};
// Create a custom hook to use the context
export var useA11y = function () { return useContext(A11yContext); };
export default A11yContext;
