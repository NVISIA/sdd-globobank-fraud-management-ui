/**
 * React Query key factory for consistent cache management
 */

export const queryKeys = {
    // Fraud Cases
    fraudCases: {
        all: ['fraud-cases'] as const,
        lists: () => [...queryKeys.fraudCases.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.fraudCases.lists(), filters] as const,
        details: () => [...queryKeys.fraudCases.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.fraudCases.details(), id] as const,
        stats: () => [...queryKeys.fraudCases.all, 'stats'] as const,
    },

    // Customers
    customers: {
        all: ['customers'] as const,
        lists: () => [...queryKeys.customers.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.customers.lists(), filters] as const,
        details: () => [...queryKeys.customers.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.customers.details(), id] as const,
        search: (params?: Record<string, unknown>) => [...queryKeys.customers.all, 'search', params] as const,
        fraudCases: (customerId: string) => [...queryKeys.customers.detail(customerId), 'fraud-cases'] as const,
        transactions: (customerId: string) => [...queryKeys.customers.detail(customerId), 'transactions'] as const,
    },

    // Transactions
    transactions: {
        all: ['transactions'] as const,
        lists: () => [...queryKeys.transactions.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.transactions.lists(), filters] as const,
        details: () => [...queryKeys.transactions.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
        search: (params?: Record<string, unknown>) => [...queryKeys.transactions.all, 'search', params] as const,
        flagged: () => [...queryKeys.transactions.all, 'flagged'] as const,
    },

    // Users
    users: {
        all: ['users'] as const,
        lists: () => [...queryKeys.users.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
        details: () => [...queryKeys.users.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.users.details(), id] as const,
        me: () => [...queryKeys.users.all, 'me'] as const,
    },

    // Analytics
    analytics: {
        all: ['analytics'] as const,
        dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
        fraudTrends: (period?: string) => [...queryKeys.analytics.all, 'fraud-trends', period] as const,
        riskScores: (period?: string) => [...queryKeys.analytics.all, 'risk-scores', period] as const,
        transactionVolume: (period?: string) => [...queryKeys.analytics.all, 'transaction-volume', period] as const,
    },

    // Notifications
    notifications: {
        all: ['notifications'] as const,
        lists: () => [...queryKeys.notifications.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.notifications.lists(), filters] as const,
        unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    },
} as const;