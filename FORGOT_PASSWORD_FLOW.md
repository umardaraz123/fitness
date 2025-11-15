# Forgot Password Flow - API Integration

## Complete Flow Overview

The password recovery process consists of 3 steps:

### Step 1: Request OTP (`/forgot-password`)
**Page:** `/forgot-password` (ForgotPassword.jsx)

**API Endpoint:** `POST /forgot-password`

**Payload:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": []
}
```

**Flow:**
1. User enters their email address
2. Form validates email format
3. API call sends OTP to user's email
4. On success, navigate to `/auth-code` page with email in state
5. Toast notification shows success message

---

### Step 2: Verify OTP (`/verify-otp`)
**Page:** `/auth-code` (AuthCode.jsx)

**API Endpoint:** `POST /verify-otp`

**Payload:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": []
}
```

**Flow:**
1. User enters 6-digit OTP code
2. Email is passed from previous page via navigation state
3. OTP digits are validated (must be 6 digits)
4. API call verifies the OTP
5. On success, navigate to `/confirm-password` page with email AND otp in state
6. Toast notification shows success message
7. **Resend Code** button re-calls `/forgot-password` API to send new OTP

---

### Step 3: Reset Password (`/reset-password`)
**Page:** `/confirm-password` (ConfirmPassword.jsx)

**API Endpoint:** `POST /reset-password`

**Payload:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": []
}
```

**Flow:**
1. Email and OTP are passed from previous page via navigation state
2. User enters new password and confirmation
3. Form validates:
   - Password length (minimum 8 characters)
   - Password complexity (uppercase, lowercase, number)
   - Password match
4. API call resets the password using email, otp, and new password
5. On success, show success toast and redirect to `/login` page
6. User can now login with new password

---

## Features Implemented

### ✅ ForgotPassword.jsx
- Email validation
- API integration with `/forgot-password`
- Error handling and display
- Loading states
- Toast notifications
- Navigation to auth-code with email

### ✅ AuthCode.jsx
- 6-digit OTP input with auto-focus
- Only numeric input allowed
- Email retrieved from navigation state
- API integration with `/verify-otp`
- Resend OTP functionality
- Error handling and display
- Loading states for both verify and resend
- Toast notifications
- Navigation to confirm-password with email and otp

### ✅ ConfirmPassword.jsx
- Password and confirmation inputs with show/hide toggle
- Email and OTP retrieved from navigation state
- Form validation:
  - Password required
  - Minimum 8 characters
  - Must contain uppercase, lowercase, and number
  - Passwords must match
- API integration with `/reset-password`
- Error handling and display
- Loading states
- Toast notifications
- Auto redirect to login on success

---

## API Service Updates

Updated `src/services/api.service.js`:

```javascript
export const authAPI = {
  // ... other methods

  // Forgot password - sends OTP
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/forgot-password', { email });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await axiosInstance.post('/verify-otp', { email, otp });
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await axiosInstance.post('/reset-password', data);
    return response.data;
  },
};
```

---

## State Management

### Navigation State Flow:

```
/forgot-password
    ↓ (on success, passes email)
/auth-code (receives: email)
    ↓ (on success, passes email + otp)
/confirm-password (receives: email, otp)
    ↓ (on success)
/login
```

### Data Persistence:
- Email: Passed from ForgotPassword → AuthCode → ConfirmPassword
- OTP: Passed from AuthCode → ConfirmPassword
- Both are required for the final reset password API call

---

## Error Handling

All three pages include:
- **Form validation errors** - displayed below each input field
- **API error messages** - displayed in a red alert box
- **Toast notifications** - for success and error feedback
- **Loading states** - prevent duplicate submissions
- **Disabled inputs** - during loading/processing

---

## User Experience

1. **Smooth transitions** - Navigation state preserves data between pages
2. **Clear feedback** - Toast notifications for all actions
3. **Error recovery** - Resend OTP if user didn't receive it
4. **Security** - Passwords must meet complexity requirements
5. **Validation** - Real-time error clearing as user types
6. **Accessibility** - Proper labels, placeholders, and error messages

---

## Testing the Flow

1. Go to `/forgot-password`
2. Enter your email and click "Continue"
3. Check your email for 6-digit OTP
4. Enter OTP on `/auth-code` page
5. Click "Verify"
6. Enter new password and confirmation on `/confirm-password`
7. Click "Continue"
8. Login with new password on `/login` page

---

## Notes

- All API endpoints use the base URL: `https://startuppakistan.himalayatool.com/api/v1`
- OTP is typically 6 digits
- Password must be at least 8 characters with uppercase, lowercase, and number
- Toast notifications are shown for all success/error cases
- User is automatically redirected to login after successful password reset
