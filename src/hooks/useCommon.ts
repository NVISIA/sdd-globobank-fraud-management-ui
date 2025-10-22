import { useState, useEffect, useCallback } from 'react';
import { debounce } from '@/utils/helpers';

/**
 * Hook for debounced search input
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for local storage with JSON serialization
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

/**
 * Hook for managing form state with validation
 */
export function useFormState<T extends Record<string, any>>(
    initialValues: T,
    validationSchema?: any
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setValue = useCallback((field: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
        setTouched(prev => ({ ...prev, [field]: isTouched }));
    }, []);

    const validateField = useCallback((field: keyof T, value: any) => {
        if (!validationSchema) return null;

        try {
            const fieldSchema = validationSchema.shape[field];
            if (fieldSchema) {
                fieldSchema.parse(value);
                return null;
            }
        } catch (error: any) {
            return error.errors?.[0]?.message || 'Invalid value';
        }
        return null;
    }, [validationSchema]);

    const validateForm = useCallback(() => {
        if (!validationSchema) return true;

        try {
            validationSchema.parse(values);
            setErrors({});
            return true;
        } catch (error: any) {
            const fieldErrors: Partial<Record<keyof T, string>> = {};

            error.errors?.forEach((err: any) => {
                const field = err.path?.[0];
                if (field) {
                    fieldErrors[field as keyof T] = err.message;
                }
            });

            setErrors(fieldErrors);
            return false;
        }
    }, [values, validationSchema]);

    const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
        setIsSubmitting(true);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => ({
            ...acc,
            [key]: true,
        }), {});
        setTouched(allTouched);

        // Validate form
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validateForm]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        setValue,
        setFieldTouched,
        validateField,
        validateForm,
        handleSubmit,
        reset,
    };
}

/**
 * Hook for managing pagination state
 */
export function usePagination(initialPage = 1, initialPageSize = 10) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const goToNextPage = useCallback(() => {
        setCurrentPage(prev => prev + 1);
    }, []);

    const goToPreviousPage = useCallback(() => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    }, []);

    const reset = useCallback(() => {
        setCurrentPage(initialPage);
        setPageSize(initialPageSize);
    }, [initialPage, initialPageSize]);

    return {
        currentPage,
        pageSize,
        setPageSize,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        reset,
    };
}

/**
 * Hook for managing async operations
 */
export function useAsyncOperation<T = any, E = Error>() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await asyncFunction();
            setData(result);
            return result;
        } catch (err) {
            setError(err as E);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        data,
        error,
        isLoading,
        execute,
        reset,
    };
}

/**
 * Hook for managing table sorting and filtering
 */
export function useTableState<T extends Record<string, any>>(
    initialSortBy?: keyof T,
    initialSortOrder: 'asc' | 'desc' = 'asc'
) {
    const [sortBy, setSortBy] = useState<keyof T | undefined>(initialSortBy);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
    const [filters, setFilters] = useState<Partial<T>>({});
    const [searchQuery, setSearchQuery] = useState('');

    const handleSort = useCallback((field: keyof T) => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    }, [sortBy]);

    const setFilter = useCallback((field: keyof T, value: T[keyof T] | undefined) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchQuery('');
    }, []);

    const reset = useCallback(() => {
        setSortBy(initialSortBy);
        setSortOrder(initialSortOrder);
        setFilters({});
        setSearchQuery('');
    }, [initialSortBy, initialSortOrder]);

    return {
        sortBy,
        sortOrder,
        filters,
        searchQuery,
        setSearchQuery,
        handleSort,
        setFilter,
        clearFilters,
        reset,
    };
}