/**
 * General utility functions for the fraud management system
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Priority, RiskLevel } from '../types';

/**
 * Utility function to merge Tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Generate unique IDs
 */
export function generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Debounce function for search inputs and API calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle function for limiting API calls
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
        const clonedObj = {} as { [key: string]: any };
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone((obj as { [key: string]: any })[key]);
            }
        }
        return clonedObj as T;
    }

    return obj;
}

/**
 * Check if two objects are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
        return a === b;
    }

    if (a === null || a === undefined || b === null || b === undefined) {
        return false;
    }

    if (a.prototype !== b.prototype) return false;

    let keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
        return false;
    }

    return keys.every(k => deepEqual(a[k], b[k]));
}

/**
 * Convert enum to options array for select components
 */
export function enumToOptions<T extends Record<string, string>>(
    enumObject: T,
    labelMap?: Partial<Record<keyof T, string>>
): Array<{ value: string; label: string }> {
    return Object.entries(enumObject).map(([key, value]) => ({
        value,
        label: labelMap?.[key as keyof T] || key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }));
}/**
 * Get priority color class
 */
export function getPriorityColor(priority: Priority): string {
    const colors = {
        [Priority.LOW]: 'text-green-600 bg-green-50',
        [Priority.MEDIUM]: 'text-yellow-600 bg-yellow-50',
        [Priority.HIGH]: 'text-orange-600 bg-orange-50',
        [Priority.CRITICAL]: 'text-red-600 bg-red-50'
    };

    return colors[priority] || 'text-gray-600 bg-gray-50';
}

/**
 * Get risk level color class
 */
export function getRiskLevelColor(riskLevel: RiskLevel): string {
    const colors = {
        [RiskLevel.LOW]: 'text-green-600 bg-green-50',
        [RiskLevel.MEDIUM]: 'text-yellow-600 bg-yellow-50',
        [RiskLevel.HIGH]: 'text-orange-600 bg-orange-50',
        [RiskLevel.VERY_HIGH]: 'text-red-600 bg-red-50'
    };

    return colors[riskLevel] || 'text-gray-600 bg-gray-50';
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
        PENDING: 'text-yellow-600 bg-yellow-50',
        UNDER_REVIEW: 'text-blue-600 bg-blue-50',
        INVESTIGATING: 'text-purple-600 bg-purple-50',
        RESOLVED: 'text-green-600 bg-green-50',
        CLOSED: 'text-gray-600 bg-gray-50',
        ESCALATED: 'text-red-600 bg-red-50',
        COMPLETED: 'text-green-600 bg-green-50',
        FAILED: 'text-red-600 bg-red-50',
        CANCELLED: 'text-gray-600 bg-gray-50',
        SUSPICIOUS: 'text-orange-600 bg-orange-50',
        BLOCKED: 'text-red-600 bg-red-50'
    };

    return statusColors[status] || 'text-gray-600 bg-gray-50';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Convert file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Sort array by multiple criteria
 */
export function multiSort<T>(
    array: T[],
    sortCriteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] {
    return array.sort((a, b) => {
        for (const criterion of sortCriteria) {
            const { key, direction } = criterion;
            const aVal = a[key];
            const bVal = b[key];

            let comparison = 0;
            if (aVal > bVal) comparison = 1;
            if (aVal < bVal) comparison = -1;

            if (comparison !== 0) {
                return direction === 'desc' ? -comparison : comparison;
            }
        }
        return 0;
    });
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
        const group = String(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Local storage utilities with error handling
 */
export const localStorage = {
    set: (key: string, value: any): void => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    get: <T>(key: string, defaultValue?: T): T | null => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue || null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue || null;
        }
    },

    remove: (key: string): void => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    clear: (): void => {
        try {
            window.localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};