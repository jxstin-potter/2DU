import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
var ThemeContext = createContext(undefined);
export var ThemeProvider = function (_a) {
    var children = _a.children;
    var _b = useState(function () {
        var savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    }), mode = _b[0], setMode = _b[1];
    useEffect(function () {
        localStorage.setItem('themeMode', mode);
    }, [mode]);
    var toggleColorMode = useCallback(function () {
        setMode(function (prevMode) { return (prevMode === 'light' ? 'dark' : 'light'); });
    }, []);
    var contextValue = useMemo(function () { return ({
        mode: mode,
        toggleColorMode: toggleColorMode,
    }); }, [mode, toggleColorMode]);
    return (_jsx(ThemeContext.Provider, { value: contextValue, children: children }));
};
export var useTheme = function () {
    var context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
