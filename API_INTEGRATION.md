# API Integration Guide

## Configuration

The API base URL is configured in `.env` file:
```
VITE_API_BASE_URL=https://startuppakistan.himalayatool.com/api/v1
```

## Authentication

### Register
**Endpoint:** `POST /auth/register`

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!",
  "terms_accepted": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 15,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "guid": "efdaa2c0-be72-4be5-be79-12103f43cdad",
      "terms_accepted_at": "2025-11-02T08:11:20.155346Z",
      "created_at": "2025-11-02T08:11:20.000000Z",
      "updated_at": "2025-11-02T08:11:20.000000Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer"
  }
}
```

### Login
**Endpoint:** `POST /auth/login`

**Payload:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Response:** Same as registration

## Usage

### Using API Services

```javascript
import { authAPI } from './services/api.service';

// Register
const response = await authAPI.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Password123!',
  password_confirmation: 'Password123!',
  terms_accepted: 1
});

// Login
const response = await authAPI.login({
  email: 'john@example.com',
  password: 'Password123!'
});
```

### Using Contexts

```javascript
// Auth Context
import { useAuth } from './context/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();

// Cart Context
import { useCart } from './context/CartContext';

const { cartItems, addToCart, removeFromCart, cartCount } = useCart();

// Toast Context
import { useToast } from './context/ToastContext';

const { showSuccess, showError, showWarning, showInfo } = useToast();
```

### Using Custom Hooks

```javascript
import { useApi } from './hooks/useApi';
import { productAPI } from './services/api.service';

const { execute, loading, error, data } = useApi();

// Make API call
await execute(productAPI.getProducts, { category: 'supplements' });
```

## File Structure

```
src/
├── config/
│   └── axios.config.js       # Axios configuration with interceptors
├── context/
│   ├── AuthContext.jsx       # Authentication state management
│   ├── CartContext.jsx       # Shopping cart state management
│   └── ToastContext.jsx      # Toast notifications
├── services/
│   └── api.service.js        # All API endpoints
├── hooks/
│   └── useApi.js            # Custom hook for API calls
├── utils/
│   ├── constants.js         # App-wide constants
│   └── errorHandler.js      # Error handling utilities
└── components/
    └── Toast.jsx            # Toast notification component
```

## Features

- ✅ Global state management (Auth, Cart, Toast)
- ✅ Axios configuration with interceptors
- ✅ Automatic token injection
- ✅ Global error handling
- ✅ Toast notifications
- ✅ Form validation
- ✅ Loading states
- ✅ Error states
- ✅ LocalStorage persistence
