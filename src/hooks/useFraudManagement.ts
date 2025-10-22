import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api';
import type {
    FraudCase,
    Transaction,
    Customer,
    PaginatedResponse,
    ApiError
} from '@/types';
import type {
    CreateFraudCaseInput,
    UpdateFraudCaseInput,
    CustomerSearchInput,
    TransactionSearchInput,
} from '@/schemas';/**
 * Hook for fetching fraud cases with pagination and filtering
 */
export function useFraudCases(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    assignedTo?: string;
}) {
    return useQuery({
        queryKey: queryKeys.fraudCases.list(params),
        queryFn: async () => {
            const response = await apiClient.get<PaginatedResponse<FraudCase>>('/fraud-cases', {
                params,
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook for fetching a single fraud case
 */
export function useFraudCase(id: string) {
    return useQuery({
        queryKey: queryKeys.fraudCases.detail(id),
        queryFn: async () => {
            const response = await apiClient.get<FraudCase>(`/fraud-cases/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Hook for creating a new fraud case
 */
export function useCreateFraudCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateFraudCaseInput) => {
            const response = await apiClient.post<FraudCase>('/fraud-cases', data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch fraud cases list
            queryClient.invalidateQueries({ queryKey: queryKeys.fraudCases.all });
        },
        onError: (error: ApiError) => {
            console.error('Failed to create fraud case:', error);
        },
    });
}

/**
 * Hook for updating a fraud case
 */
export function useUpdateFraudCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateFraudCaseInput) => {
            const response = await apiClient.put<FraudCase>(`/fraud-cases/${data.id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // Update specific fraud case in cache
            queryClient.setQueryData(queryKeys.fraudCases.detail(data.id), data);
            // Invalidate fraud cases list
            queryClient.invalidateQueries({ queryKey: queryKeys.fraudCases.all });
        },
        onError: (error: ApiError) => {
            console.error('Failed to update fraud case:', error);
        },
    });
}

/**
 * Hook for deleting a fraud case
 */
export function useDeleteFraudCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/fraud-cases/${id}`);
            return id;
        },
        onSuccess: (id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: queryKeys.fraudCases.detail(id) });
            // Invalidate fraud cases list
            queryClient.invalidateQueries({ queryKey: queryKeys.fraudCases.all });
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete fraud case:', error);
        },
    });
}

/**
 * Hook for searching customers
 */
export function useCustomerSearch(searchParams: CustomerSearchInput) {
    return useQuery({
        queryKey: queryKeys.customers.search(searchParams),
        queryFn: async () => {
            const response = await apiClient.post<PaginatedResponse<Customer>>('/customers/search', searchParams);
            return response.data;
        },
        enabled: !!searchParams.query,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook for fetching a single customer
 */
export function useCustomer(id: string) {
    return useQuery({
        queryKey: queryKeys.customers.detail(id),
        queryFn: async () => {
            const response = await apiClient.get<Customer>(`/customers/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Hook for fetching customer's fraud cases
 */
export function useCustomerFraudCases(customerId: string) {
    return useQuery({
        queryKey: queryKeys.customers.fraudCases(customerId),
        queryFn: async () => {
            const response = await apiClient.get<FraudCase[]>(`/customers/${customerId}/fraud-cases`);
            return response.data;
        },
        enabled: !!customerId,
    });
}

/**
 * Hook for searching transactions
 */
export function useTransactionSearch(searchParams: TransactionSearchInput) {
    return useQuery({
        queryKey: queryKeys.transactions.search(searchParams),
        queryFn: async () => {
            const response = await apiClient.post<PaginatedResponse<Transaction>>('/transactions/search', searchParams);
            return response.data;
        },
        enabled: Object.keys(searchParams).length > 0,
        staleTime: 1000 * 60 * 1, // 1 minute
    });
}

/**
 * Hook for fetching a single transaction
 */
export function useTransaction(id: string) {
    return useQuery({
        queryKey: queryKeys.transactions.detail(id),
        queryFn: async () => {
            const response = await apiClient.get<Transaction>(`/transactions/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Hook for flagging a transaction as suspicious
 */
export function useFlagTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ transactionId, reason }: { transactionId: string; reason: string }) => {
            const response = await apiClient.post<Transaction>(`/transactions/${transactionId}/flag`, { reason });
            return response.data;
        },
        onSuccess: (data) => {
            // Update transaction in cache
            queryClient.setQueryData(queryKeys.transactions.detail(data.id), data);
            // Invalidate transaction searches
            queryClient.invalidateQueries({ queryKey: queryKeys.transactions.search({}) });
        },
        onError: (error: ApiError) => {
            console.error('Failed to flag transaction:', error);
        },
    });
}

/**
 * Hook for assigning a fraud case to a user
 */
export function useAssignFraudCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ caseId, assignedTo, comment }: { caseId: string; assignedTo: string; comment?: string }) => {
            const response = await apiClient.post<FraudCase>(`/fraud-cases/${caseId}/assign`, {
                assignedTo,
                comment,
            });
            return response.data;
        },
        onSuccess: (data) => {
            // Update fraud case in cache
            queryClient.setQueryData(queryKeys.fraudCases.detail(data.id), data);
            // Invalidate fraud cases list
            queryClient.invalidateQueries({ queryKey: queryKeys.fraudCases.all });
        },
        onError: (error: ApiError) => {
            console.error('Failed to assign fraud case:', error);
        },
    });
}

/**
 * Hook for resolving a fraud case
 */
export function useResolveFraudCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            caseId,
            resolution,
            actionsTaken,
            followUpRequired,
            followUpDate
        }: {
            caseId: string;
            resolution: string;
            actionsTaken: string[];
            followUpRequired: boolean;
            followUpDate?: Date;
        }) => {
            const response = await apiClient.post<FraudCase>(`/fraud-cases/${caseId}/resolve`, {
                resolution,
                actionsTaken,
                followUpRequired,
                followUpDate,
            });
            return response.data;
        },
        onSuccess: (data) => {
            // Update fraud case in cache
            queryClient.setQueryData(queryKeys.fraudCases.detail(data.id), data);
            // Invalidate fraud cases list
            queryClient.invalidateQueries({ queryKey: queryKeys.fraudCases.all });
        },
        onError: (error: ApiError) => {
            console.error('Failed to resolve fraud case:', error);
        },
    });
}