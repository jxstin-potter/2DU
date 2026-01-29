var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
var RECENTLY_VIEWED_KEY = 'search-recently-viewed';
var MAX_RECENT_VIEWS = 8;
var PATH_CONFIG = {
    '/today': { labelKey: 'sidebar.today', icon: 'today' },
    '/completed': { labelKey: 'sidebar.completed', icon: 'completed' },
    '/settings': { labelKey: 'sidebar.settings', icon: 'settings' },
};
function loadRecentViews() {
    try {
        var raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (!raw)
            return [];
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT_VIEWS) : [];
    }
    catch (_a) {
        return [];
    }
}
function saveRecentViews(views) {
    try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(views.slice(0, MAX_RECENT_VIEWS)));
    }
    catch (_a) {
        // ignore
    }
}
var SearchModalContext = createContext(undefined);
export var SearchModalProvider = function (_a) {
    var children = _a.children;
    var _b = useState(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = useState(loadRecentViews), recentViews = _c[0], setRecentViews = _c[1];
    useEffect(function () {
        saveRecentViews(recentViews);
    }, [recentViews]);
    var openModal = useCallback(function () {
        setIsOpen(true);
    }, []);
    var closeModal = useCallback(function () {
        setIsOpen(false);
    }, []);
    var recordRecentView = useCallback(function (path) {
        var config = PATH_CONFIG[path];
        if (!config)
            return;
        setRecentViews(function (prev) {
            var entry = { path: path, labelKey: config.labelKey, icon: config.icon };
            var without = prev.filter(function (v) { return v.path !== path; });
            return __spreadArray([entry], without, true).slice(0, MAX_RECENT_VIEWS);
        });
    }, []);
    return (_jsx(SearchModalContext.Provider, { value: { isOpen: isOpen, openModal: openModal, closeModal: closeModal, recentViews: recentViews, recordRecentView: recordRecentView }, children: children }));
};
export var useSearchModal = function () {
    var context = useContext(SearchModalContext);
    if (context === undefined) {
        throw new Error('useSearchModal must be used within a SearchModalProvider');
    }
    return context;
};
