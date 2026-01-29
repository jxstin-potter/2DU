import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { setLanguage, getLanguage, initLanguage, t, formatDate, formatRelativeDate, formatDistanceDate, formatNumber, formatCurrency } from '../utils/i18n';
// Create the context with a default value
var I18nContext = createContext({
    language: 'en',
    setLanguage: function () { },
    t: function (key) { return key; },
    formatDate: function (date) { return date.toString(); },
    formatRelativeDate: function (date) { return date.toString(); },
    formatDistanceDate: function (date) { return date.toString(); },
    formatNumber: function (number) { return number.toString(); },
    formatCurrency: function (amount) { return amount.toString(); },
});
export var I18nProvider = function (_a) {
    var children = _a.children;
    var _b = useState(getLanguage()), language = _b[0], setLanguageState = _b[1];
    // Initialize language on mount
    useEffect(function () {
        initLanguage();
        var currentLang = getLanguage();
        setLanguageState(currentLang);
    }, []);
    // Handle language change
    var handleSetLanguage = useCallback(function (newLanguage) {
        setLanguage(newLanguage);
        setLanguageState(newLanguage);
    }, []);
    // Create the context value - memoize to prevent unnecessary re-renders
    // Note: t, formatDate, etc. are imported functions that are stable, so they don't need memoization
    var contextValue = useMemo(function () { return ({
        language: language,
        setLanguage: handleSetLanguage,
        t: t,
        formatDate: formatDate,
        formatRelativeDate: formatRelativeDate,
        formatDistanceDate: formatDistanceDate,
        formatNumber: formatNumber,
        formatCurrency: formatCurrency,
    }); }, [language, handleSetLanguage]);
    return _jsx(I18nContext.Provider, { value: contextValue, children: children });
};
// Create a custom hook to use the context
export var useI18n = function () { return useContext(I18nContext); };
export default I18nContext;
