import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { User, AuthState, UserRole } from '@/types';
import { useLocalStorage } from '@/hooks';

// Auth Actions
type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'AUTH_FAILURE'; payload: { error: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }
    | { type: 'CLEAR_ERROR' };

// Auth Context Type
interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    error: string | null;
}

// Initial State
const initialState: AuthState & { error: string | null } = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Auth Reducer
function authReducer(
    state: AuthState & { error: string | null },
    action: AuthAction
): AuthState & { error: string | null } {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload.error,
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                error: null,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [storedToken, setStoredToken] = useLocalStorage<string | null>('auth_token', null);
    const [storedUser, setStoredUser] = useLocalStorage<User | null>('auth_user', null);
    const router = useRouter();

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        if (storedToken && storedUser) {
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: storedUser, token: storedToken },
            });
        } else {
            dispatch({ type: 'LOGOUT' });
        }
    }, [storedToken, storedUser]);

    // Login function
    const login = async (email: string, password: string): Promise<void> => {
        dispatch({ type: 'AUTH_START' });

        try {
            // Mock API call for now - replace with actual API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const { user, token } = data;

            // Store in localStorage
            setStoredToken(token);
            setStoredUser(user);

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token },
            });

            // Redirect to dashboard after successful login
            await router.push('/dashboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({
                type: 'AUTH_FAILURE',
                payload: { error: errorMessage },
            });
            throw error;
        }
    };

    // Logout function
    const logout = (): void => {
        // Clear localStorage
        setStoredToken(null);
        setStoredUser(null);

        dispatch({ type: 'LOGOUT' });

        // Redirect to login page
        router.push('/login');
    };

    // Update user function
    const updateUser = (user: User): void => {
        setStoredUser(user);
        dispatch({ type: 'SET_USER', payload: user });
    };

    // Role checking functions
    const hasRole = (role: UserRole): boolean => {
        return state.user?.role === role;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return state.user ? roles.includes(state.user.role) : false;
    };

    const contextValue: AuthContextType = {
        ...state,
        login,
        logout,
        updateUser,
        hasRole,
        hasAnyRole,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Higher-order component for role-based access
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    requiredRoles?: UserRole[]
) {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    router.push('/login');
                    return;
                }

                if (requiredRoles && !hasAnyRole(requiredRoles)) {
                    router.push('/unauthorized');
                    return;
                }
            }
        }, [isAuthenticated, isLoading, hasAnyRole, router]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return null; // Will redirect to login
        }

        if (requiredRoles && !hasAnyRole(requiredRoles)) {
            return null; // Will redirect to unauthorized
        }

        return <Component {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

    return AuthenticatedComponent;
}