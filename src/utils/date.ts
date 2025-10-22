/**
 * Date utility functions for the fraud management system
 */

import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes, isValid } from 'date-fns';

/**
 * Format a date string or Date object to a readable format
 */
export function formatDate(date: string | Date, formatString: string = 'MMM dd, yyyy'): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            return 'Invalid Date';
        }
        return format(dateObj, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format a date to include time
 */
export function formatDateTime(date: string | Date): string {
    return formatDate(date, 'MMM dd, yyyy HH:mm:ss');
}

/**
 * Format a date for display in data tables
 */
export function formatTableDate(date: string | Date): string {
    return formatDate(date, 'MM/dd/yyyy');
}

/**
 * Format a date for form inputs
 */
export function formatInputDate(date: string | Date): string {
    return formatDate(date, 'yyyy-MM-dd');
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        const now = new Date();

        if (!isValid(dateObj)) {
            return 'Invalid Date';
        }

        const days = differenceInDays(now, dateObj);
        const hours = differenceInHours(now, dateObj);
        const minutes = differenceInMinutes(now, dateObj);

        if (days > 0) {
            return `${days} day${days === 1 ? '' : 's'} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        } else {
            return 'Just now';
        }
    } catch (error) {
        console.error('Error calculating relative time:', error);
        return 'Unknown';
    }
}

/**
 * Check if a date is within the last N days
 */
export function isWithinDays(date: string | Date, days: number): boolean {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        const now = new Date();

        if (!isValid(dateObj)) {
            return false;
        }

        return differenceInDays(now, dateObj) <= days;
    } catch (error) {
        console.error('Error checking date range:', error);
        return false;
    }
}

/**
 * Get the start and end of today for filtering
 */
export function getTodayRange(): { start: string; end: string } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}

/**
 * Get date range for common filters
 */
export function getDateRange(period: 'today' | 'week' | 'month' | 'quarter' | 'year'): { start: string; end: string } {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start: Date;

    switch (period) {
        case 'today':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            break;
        case 'month':
            start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        case 'quarter':
            start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            break;
        case 'year':
            start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            break;
        default:
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}