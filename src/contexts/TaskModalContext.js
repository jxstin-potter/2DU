import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
var TaskModalContext = createContext(undefined);
export var TaskModalProvider = function (_a) {
    var children = _a.children;
    var _b = useState(false), isOpen = _b[0], setIsOpen = _b[1];
    var openModal = useCallback(function () {
        setIsOpen(true);
    }, []);
    var closeModal = useCallback(function () {
        setIsOpen(false);
    }, []);
    return (_jsx(TaskModalContext.Provider, { value: { isOpen: isOpen, openModal: openModal, closeModal: closeModal }, children: children }));
};
export var useTaskModal = function () {
    var context = useContext(TaskModalContext);
    if (context === undefined) {
        throw new Error('useTaskModal must be used within a TaskModalProvider');
    }
    return context;
};
