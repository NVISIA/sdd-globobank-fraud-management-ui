import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginInput } from '@/schemas';
// Modern styling uses custom CSS classes instead of component library
import { GloboBankWordmark } from '@/components/ui/Logo';

const LoginPage: NextPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const redirect = router.query.redirect as string;
            router.push(redirect || '/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            await login(data.email, data.password);
            // Redirect is handled in the login function
        } catch (error) {
            setLoginError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-blue-100 opacity-20"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-blue-200 opacity-20"></div>
            </div>

            <div className="relative max-w-md w-full space-y-8 animate-fade-in">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <GloboBankWordmark />
                    </div>
                    <h2 className="heading-lg text-slate-900">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-muted">
                        Sign in to access your fraud management dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="card-elevated animate-slide-up"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <div className="p-8">
                        <h3 className="heading-sm text-center mb-6">Sign In</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Error Message */}
                            {loginError && (
                                <div className="status-error p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm font-medium">{loginError}</p>
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className={`input-modern ${errors.email ? 'input-error' : ''}`}
                                    placeholder="analyst@globobank.com"
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className={`input-modern ${errors.password ? 'input-error' : ''}`}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            {/* Demo Credentials */}
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <h4 className="text-sm font-medium text-slate-900 mb-2">Demo Credentials:</h4>
                                <div className="text-xs text-slate-600 space-y-1">
                                    <p><strong>Username:</strong> analyst (or analyst@globobank.com)</p>
                                    <p><strong>Password:</strong> password123</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-subtle animate-fade-in"
                    style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    <p>
                        Need help?{' '}
                        <Link href="/auth/request-access" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            Contact support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;