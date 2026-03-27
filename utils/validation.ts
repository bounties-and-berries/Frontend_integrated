/**
 * Validation utilities for user inputs
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 * At least 8 characters, one uppercase, one lowercase, one number
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/\d/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): { valid: boolean; message?: string } => {
    if (value === null || value === undefined || value === '') {
        return { valid: false, message: `${fieldName} is required` };
    }
    if (typeof value === 'string' && value.trim() === '') {
        return { valid: false, message: `${fieldName} cannot be empty` };
    }
    return { valid: true };
};

/**
 * Validate number range
 */
export const validateNumberRange = (
    value: number,
    min: number,
    max: number,
    fieldName: string
): { valid: boolean; message?: string } => {
    if (isNaN(value)) {
        return { valid: false, message: `${fieldName} must be a number` };
    }
    if (value < min || value > max) {
        return { valid: false, message: `${fieldName} must be between ${min} and ${max}` };
    }
    return { valid: true };
};

/**
 * Validate file size (in bytes)
 */
export const validateFileSize = (
    fileSize: number,
    maxSize: number = 5 * 1024 * 1024 // 5MB default
): { valid: boolean; message?: string } => {
    if (fileSize > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return { valid: false, message: `File size must be less than ${maxSizeMB}MB` };
    }
    return { valid: true };
};

/**
 * Validate file type
 */
export const validateFileType = (
    fileName: string,
    allowedTypes: string[]
): { valid: boolean; message?: string } => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension || !allowedTypes.includes(extension)) {
        return { valid: false, message: `File type must be one of: ${allowedTypes.join(', ')}` };
    }
    return { valid: true };
};
