// FILE PURPOSE:
// - Application entry point
// - Initialize React app and mount to DOM
// - Wrap app with all context providers
// - Import global styles

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { ProductsProvider } from './contexts/ProductsContext.jsx';
import { ChatProvider } from './contexts/ChatContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);