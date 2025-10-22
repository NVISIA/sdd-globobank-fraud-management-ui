import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: NextPage = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.push('/dashboard');
            } else {
                router.push('/auth/login');
            }
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while determining authentication status
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading GloboBank Fraud Management...</p>
            </div>
        </div>
    );
};

export default HomePage;