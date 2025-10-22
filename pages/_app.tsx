import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    // Create a client instance for React Query
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
                        retry: (failureCount, error: any) => {
                            // Don't retry on 401/403 errors
                            if (error?.response?.status === 401 || error?.response?.status === 403) {
                                return false;
                            }
                            return failureCount < 3;
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Component {...pageProps} />
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </AuthProvider>
        </QueryClientProvider>
    );
}