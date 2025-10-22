/**
 * Validation utility functions for the fraud management system
 */

import { isValidEmail as isEmailValid } from '../types';

/**
 * Validate email address
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || email.trim().length === 0) {
        return { isValid: false, error: 'Email is required' };
    }

    if (!isEmailValid(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } {
    if (!password || password.length === 0) {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long', strength: 'weak' };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaMet = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (criteriaMet < 3) {
        return {
            isValid: false,
            error: 'Password must contain at least 3 of: uppercase letter, lowercase letter, number, special character',
            strength: 'weak'
        };
    }

    const strength = criteriaMet === 4 ? 'strong' : 'medium';
    return { isValid: true, strength };
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
    if (!phone || phone.trim().length === 0) {
        return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.length < 10) {
        return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }

    if (cleaned.length > 15) {
        return { isValid: false, error: 'Phone number cannot exceed 15 digits' };
    }

    return { isValid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value: string | number | null | undefined, fieldName: string): { isValid: boolean; error?: string } {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
}

/**
 * Validate amount
 */
export function validateAmount(amount: string | number, fieldName: string = 'Amount'): { isValid: boolean; error?: string } {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        return { isValid: false, error: `${fieldName} must be a valid number` };
    }

    if (num < 0) {
        return { isValid: false, error: `${fieldName} cannot be negative` };
    }

    if (num > 1000000000) {
        return { isValid: false, error: `${fieldName} cannot exceed $1 billion` };
    }

    return { isValid: true };
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: string, endDate: string): { isValid: boolean; error?: string } {
    if (!startDate || !endDate) {
        return { isValid: false, error: 'Both start and end dates are required' };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { isValid: false, error: 'Invalid date format' };
    }

    if (start > end) {
        return { isValid: false, error: 'Start date cannot be after end date' };
    }

    // Check if date range is not too large (e.g., more than 2 years)
    const daysDifference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 730) {
        return { isValid: false, error: 'Date range cannot exceed 2 years' };
    }

    return { isValid: true };
}

/**
 * Validate case ID format
 */
export function validateCaseId(caseId: string): { isValid: boolean; error?: string } {
    if (!caseId || caseId.trim().length === 0) {
        return { isValid: false, error: 'Case ID is required' };
    }

    // Case ID should be alphanumeric and can contain hyphens
    const caseIdRegex = /^[A-Za-z0-9\-]{6,20}$/;
    if (!caseIdRegex.test(caseId)) {
        return { isValid: false, error: 'Case ID must be 6-20 characters long and contain only letters, numbers, and hyphens' };
    }

    return { isValid: true };
}

/**
 * Validate transaction ID format
 */
export function validateTransactionId(transactionId: string): { isValid: boolean; error?: string } {
    if (!transactionId || transactionId.trim().length === 0) {
        return { isValid: false, error: 'Transaction ID is required' };
    }

    // Transaction ID should be alphanumeric
    const transactionIdRegex = /^[A-Za-z0-9]{8,32}$/;
    if (!transactionIdRegex.test(transactionId)) {
        return { isValid: false, error: 'Transaction ID must be 8-32 characters long and contain only letters and numbers' };
    }

    return { isValid: true };
}

/**
 * Validate customer ID format
 */
export function validateCustomerId(customerId: string): { isValid: boolean; error?: string } {
    if (!customerId || customerId.trim().length === 0) {
        return { isValid: false, error: 'Customer ID is required' };
    }

    // Customer ID should be alphanumeric and can contain hyphens
    const customerIdRegex = /^[A-Za-z0-9\-]{6,20}$/;
    if (!customerIdRegex.test(customerId)) {
        return { isValid: false, error: 'Customer ID must be 6-20 characters long and contain only letters, numbers, and hyphens' };
    }

    return { isValid: true };
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File, maxSizeInMB: number = 10, allowedTypes: string[] = ['image/*', 'application/pdf', 'text/*']): { isValid: boolean; error?: string } {
    if (!file) {
        return { isValid: false, error: 'File is required' };
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        return { isValid: false, error: `File size cannot exceed ${maxSizeInMB}MB` };
    }

    // Check file type
    const isAllowedType = allowedTypes.some(type => {
        if (type.endsWith('*')) {
            return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
    });

    if (!isAllowedType) {
        return { isValid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }

    return { isValid: true };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize text input
 */
export function validateAndSanitizeText(text: string, fieldName: string, maxLength: number = 1000): { isValid: boolean; error?: string; sanitized?: string } {
    if (!text || text.trim().length === 0) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    if (text.length > maxLength) {
        return { isValid: false, error: `${fieldName} cannot exceed ${maxLength} characters` };
    }

    const sanitized = sanitizeInput(text.trim());
    return { isValid: true, sanitized };
}