import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

const UnauthorizedPage: NextPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <CardTitle className="text-red-900">Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-600">
                            You don&apos;t have permission to access this page.
                        </p>

                        {user && (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700">
                                    <strong>Current User:</strong> {user.email}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Role:</strong> {user.role.replace('_', ' ')}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">
                                If you believe this is an error, please contact your system administrator.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/dashboard" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={logout}
                                    className="flex-1"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UnauthorizedPage;