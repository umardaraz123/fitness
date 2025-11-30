import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  </StrictMode>
)