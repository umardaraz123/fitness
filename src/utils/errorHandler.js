/**
 * Global error handler utility
 */

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access forbidden. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 422:
        return data.message || 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data.message || 'An error occurred. Please try again.';
    }
  } else if (error.request) {
    // Request was made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Format validation errors from API response
 * Converts Laravel-style validation errors into a readable format
 * 
 * @param {Object} errors - The errors object from API response
 * @returns {string} - Formatted error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return 'Validation failed. Please check your input.';
  }

  const errorMessages = [];
  
  Object.keys(errors).forEach(field => {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors)) {
      // Laravel returns array of error messages per field
      fieldErrors.forEach(errorMsg => {
        errorMessages.push(errorMsg);
      });
    } else if (typeof fieldErrors === 'string') {
      errorMessages.push(fieldErrors);
    }
  });

  return errorMessages.length > 0 
    ? errorMessages.join('\n') 
    : 'Validation failed. Please check your input.';
};

/**
 * Handle API error and return appropriate message
 * If validation errors exist, format them properly
 * 
 * @param {Error} error - The error object from API call
 * @returns {string} - Formatted error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data) {
    const { data } = error.response;
    
    // Check for validation errors
    if (data.errors && typeof data.errors === 'object') {
      return formatValidationErrors(data.errors);
    }
    
    // Return message from API
    if (data.message) {
      return data.message;
    }
  }
  
  // Fallback to generic error handler
  return handleApiError(error);
};

export const showErrorNotification = (error, notificationFunction) => {
  const message = getErrorMessage(error);
  
  if (notificationFunction) {
    notificationFunction(message, 'error');
  } else {
    console.error(message);
  }
};

export default {
  handleApiError,
  formatValidationErrors,
  getErrorMessage,
  showErrorNotification
};
