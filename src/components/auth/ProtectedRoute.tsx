import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
    fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles,
    fallback,
}) => {
    const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Redirect to login if not authenticated
            if (!isAuthenticated) {
                router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
                return;
            }

            // Check role requirements
            if (requiredRoles && !hasAnyRole(requiredRoles)) {
                router.push('/unauthorized');
                return;
            }
        }
    }, [isAuthenticated, isLoading, hasAnyRole, router, requiredRoles]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600">Authenticating...</p>
                    </div>
                </div>
            )
        );
    }

    // Don't render content while redirecting
    if (!isAuthenticated) {
        return null;
    }

    // Check role requirements
    if (requiredRoles && !hasAnyRole(requiredRoles)) {
        return null;
    }

    return <>{children}</>;
};

// Convenience components for common role requirements
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
        {children}
    </ProtectedRoute>
);

export const ManagerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProtectedRoute requiredRoles={[UserRole.FRAUD_MANAGER, UserRole.ADMIN]}>
        {children}
    </ProtectedRoute>
);

export const AnalystRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProtectedRoute
        requiredRoles={[
            UserRole.FRAUD_ANALYST,
            UserRole.SENIOR_ANALYST,
            UserRole.FRAUD_MANAGER,
            UserRole.ADMIN
        ]}
    >
        {children}
    </ProtectedRoute>
);