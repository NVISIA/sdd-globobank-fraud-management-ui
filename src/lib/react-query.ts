/**
 * React Query configuration and setup
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { ApiError } from '../types';

// Default query options
const defaultOptions: DefaultOptions = {
    queries: {
        // Stale time - how long data is considered fresh
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Cache time - how long data stays in cache after component unmounts
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

        // Retry configuration
        retry: (failureCount, error) => {
            const apiError = error as unknown as ApiError;

            // Don't retry on authentication errors
            if (apiError?.code === 'HTTP_401' || apiError?.code === 'HTTP_403') {
                return false;
            }

            // Don't retry on client errors (4xx)
            if (apiError?.code?.startsWith('HTTP_4')) {
                return false;
            }

            // Retry up to 3 times for other errors
            return failureCount < 3;
        },

        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus
        refetchOnWindowFocus: false,

        // Refetch on reconnect
        refetchOnReconnect: true,

        // Background refetch interval
        refetchInterval: false,
    },
    mutations: {
        // Retry mutations once on network errors
        retry: (failureCount, error) => {
            const apiError = error as unknown as ApiError;
            if (apiError?.code === 'NETWORK_ERROR' && failureCount < 1) {
                return true;
            }
            return false;
        },
    },
};

// Create and configure Query Client
export const queryClient = new QueryClient({
    defaultOptions,

    // Global error handler
    // mutationCache: new MutationCache({
    //   onError: (error) => {
    //     console.error('Mutation error:', error);
    //     // You can add global error handling here
    //     // For example, show a toast notification
    //   },
    // }),

    // queryCache: new QueryCache({
    //   onError: (error) => {
    //     console.error('Query error:', error);
    //     // You can add global error handling here
    //   },
    // }),
});

// Query keys for better organization
export const queryKeys = {
    // Auth
    auth: {
        user: ['auth', 'user'] as const,
        permissions: ['auth', 'permissions'] as const,
    },

    // Fraud cases
    fraudCases: {
        all: ['fraudCases'] as const,
        lists: () => [...queryKeys.fraudCases.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.fraudCases.lists(), filters] as const,
        details: () => [...queryKeys.fraudCases.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.fraudCases.details(), id] as const,
        stats: () => [...queryKeys.fraudCases.all, 'stats'] as const,
        metrics: (period?: string) => [...queryKeys.fraudCases.all, 'metrics', period] as const,
    },

    // Transactions
    transactions: {
        all: ['transactions'] as const,
        lists: () => [...queryKeys.transactions.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.transactions.lists(), filters] as const,
        details: () => [...queryKeys.transactions.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
        byCustomer: (customerId: string) => [...queryKeys.transactions.all, 'byCustomer', customerId] as const,
    },

    // Customers
    customers: {
        all: ['customers'] as const,
        lists: () => [...queryKeys.customers.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.customers.lists(), filters] as const,
        details: () => [...queryKeys.customers.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.customers.details(), id] as const,
        search: (query: string) => [...queryKeys.customers.all, 'search', query] as const,
    },

    // Alerts
    alerts: {
        all: ['alerts'] as const,
        lists: () => [...queryKeys.alerts.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.alerts.lists(), filters] as const,
        unread: () => [...queryKeys.alerts.all, 'unread'] as const,
    },

    // Notifications
    notifications: {
        all: ['notifications'] as const,
        lists: () => [...queryKeys.notifications.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.notifications.lists(), filters] as const,
        unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    },

    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
        analytics: (period?: string) => [...queryKeys.dashboard.all, 'analytics', period] as const,
    },

    // Investigations
    investigations: {
        all: ['investigations'] as const,
        lists: () => [...queryKeys.investigations.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.investigations.lists(), filters] as const,
        details: () => [...queryKeys.investigations.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.investigations.details(), id] as const,
        byCase: (caseId: string) => [...queryKeys.investigations.all, 'byCase', caseId] as const,
    },
};

// Utility functions for cache management
export const cacheUtils = {
    // Invalidate all queries
    invalidateAll: () => {
        queryClient.invalidateQueries();
    },

    // Invalidate specific query patterns
    invalidateFraudCases: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.fraudCases.all });
    },

    invalidateTransactions: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },

    invalidateCustomers: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },

    invalidateAlerts: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },

    invalidateNotifications: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },

    invalidateDashboard: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },

    // Remove specific queries from cache
    removeFraudCase: (id: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.fraudCases.detail(id) });
    },

    removeTransaction: (id: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.transactions.detail(id) });
    },

    removeCustomer: (id: string) => {
        queryClient.removeQueries({ queryKey: queryKeys.customers.detail(id) });
    },

    // Clear all cache
    clearCache: () => {
        queryClient.clear();
    },

    // Prefetch data
    prefetchFraudCase: (id: string) => {
        return queryClient.prefetchQuery({
            queryKey: queryKeys.fraudCases.detail(id),
            queryFn: () => {
                // This will be implemented in the API service layer
                throw new Error('Not implemented');
            },
        });
    },

    // Set query data manually
    setFraudCaseData: (id: string, data: any) => {
        queryClient.setQueryData(queryKeys.fraudCases.detail(id), data);
    },

    setTransactionData: (id: string, data: any) => {
        queryClient.setQueryData(queryKeys.transactions.detail(id), data);
    },

    setCustomerData: (id: string, data: any) => {
        queryClient.setQueryData(queryKeys.customers.detail(id), data);
    },
};

// Dev tools configuration
export const reactQueryDevtools = {
    initialIsOpen: false,
    position: 'bottom-right' as const,
};