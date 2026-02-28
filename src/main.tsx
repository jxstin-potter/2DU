import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './firebase' // Import Firebase configuration
import './styles/global.css' // Import our consolidated global CSS

// Register service worker (use BASE_URL so it works under GitHub Pages subpath)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker
      .register(swPath)
      .catch(() => {
        // Service worker registration failed - app will still work
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
