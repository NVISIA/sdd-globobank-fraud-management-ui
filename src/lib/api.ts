/**
 * API client configuration using Axios
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types';

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
    interface InternalAxiosRequestConfig {
        metadata?: {
            startTime: Date;
        };
    }
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage or your auth state management
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response time in development
        if (process.env.NODE_ENV === 'development') {
            const startTime = response.config.metadata?.startTime;
            if (startTime) {
                const duration = new Date().getTime() - startTime.getTime();
                console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
            }
        }

        return response;
    },
    (error: AxiosError) => {
        console.error('API Error:', error);

        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data as any;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('auth_token');
                    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    // Forbidden - show access denied message
                    console.error('Access denied');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 429:
                    // Rate limit exceeded
                    console.error('Rate limit exceeded');
                    break;
                case 500:
                    // Server error
                    console.error('Internal server error');
                    break;
                default:
                    console.error(`API Error ${status}:`, data?.message || error.message);
            }

            // Transform error response to standardized format
            const apiError: ApiError = {
                code: data?.code || `HTTP_${status}`,
                message: data?.message || error.message || 'An error occurred',
                details: data?.details || {}
            };

            return Promise.reject(apiError);
        } else if (error.request) {
            // Request was made but no response received
            const networkError: ApiError = {
                code: 'NETWORK_ERROR',
                message: 'Network error - please check your connection',
                details: { originalError: error.message }
            };

            return Promise.reject(networkError);
        } else {
            // Something else happened
            const unknownError: ApiError = {
                code: 'UNKNOWN_ERROR',
                message: error.message || 'An unknown error occurred',
                details: {}
            };

            return Promise.reject(unknownError);
        }
    }
);

// Generic API methods
export const api = {
    // GET request
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        const response = await apiClient.get<ApiResponse<T>>(url, config);
        return response.data;
    },

    // POST request
    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        const response = await apiClient.post<ApiResponse<T>>(url, data, config);
        return response.data;
    },

    // PUT request
    put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        const response = await apiClient.put<ApiResponse<T>>(url, data, config);
        return response.data;
    },

    // PATCH request
    patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    },

    // DELETE request
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        const response = await apiClient.delete<ApiResponse<T>>(url, config);
        return response.data;
    },

    // Upload file
    upload: async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> => {
        const formData = new FormData();
        formData.append('file', file);

        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        };

        const response = await apiClient.post<ApiResponse<T>>(url, formData, config);
        return response.data;
    },

    // Download file
    download: async (url: string, filename?: string): Promise<void> => {
        const response = await apiClient.get(url, {
            responseType: 'blob',
        });

        // Create blob link to download
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    }
};

// Set auth token
export const setAuthToken = (token: string | null): void => {
    if (token) {
        localStorage.setItem('auth_token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('auth_token');
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// Get current auth token
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Clear auth token
export const clearAuthToken = (): void => {
    setAuthToken(null);
};

// Health check endpoint
export const healthCheck = async (): Promise<boolean> => {
    try {
        await api.get('/health');
        return true;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
};

export default apiClient;