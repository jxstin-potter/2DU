import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './firebase'; // Import Firebase configuration
import './styles/global.css'; // Import our consolidated global CSS
// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/sw.js')
            .catch(function () {
            // Service worker registration failed - app will still work
        });
    });
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }));
