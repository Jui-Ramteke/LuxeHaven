import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite HMR and WebSocket connection errors in sandbox
if (typeof window !== 'undefined') {
  const isViteWS = (err: any) => {
    if (!err) return false;
    const msg = String(err.message || err);
    return msg.includes('WebSocket') || msg.includes('websocket') || msg.includes('vite');
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isViteWS(event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isViteWS(event.error) || isViteWS(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

