import { Alert } from 'react-native';

/**
 * Centralized error handler for API errors
 * Extracts meaningful error messages from different error types
 */
export const handleApiError = (error: any): string => {
    if (error.response) {
        // Server responded with an error status
        const message = error.response.data?.error ||
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        return message;
    } else if (error.request) {
        // Request was made but no response received
        return 'No response from server. Please check your internet connection.';
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred';
    }
};

/**
 * Show error alert to user
 * @param error - The error object
 * @param title - Alert title (default: 'Error')
 */
export const showErrorAlert = (error: any, title = 'Error') => {
    const message = handleApiError(error);
    Alert.alert(title, message);
};

/**
 * Show success alert to user
 * @param message - Success message
 * @param title - Alert title (default: 'Success')
 */
export const showSuccessAlert = (message: string, title = 'Success') => {
    Alert.alert(title, message);
};

/**
 * Log error to console in development, send to monitoring service in production
 * @param error - The error object
 * @param context - Additional context about where the error occurred
 */
export const logError = (error: any, context?: string) => {
    if (__DEV__) {
        console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    } else {
        // TODO: Send to error monitoring service (Sentry, etc.)
        // Sentry.captureException(error, { tags: { context } });
    }
};
