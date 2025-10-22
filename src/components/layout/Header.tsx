import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui';

interface HeaderProps {
    className?: string;
    user?: {
        name: string;
        email: string;
        role: string;
    };
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ className, user, onLogout }) => {
    return (
        <header className={cn(
            'border-b border-gray-200 bg-white shadow-sm',
            className
        )}>
            <div className="flex h-16 items-center justify-between px-6">
                {/* Logo and Navigation */}
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">GB</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">
                            GloboBank
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/fraud-cases"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Fraud Cases
                        </Link>
                        <Link
                            href="/transactions"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Transactions
                        </Link>
                        <Link
                            href="/customers"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Customers
                        </Link>
                        <Link
                            href="/analytics"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Analytics
                        </Link>
                    </nav>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {onLogout && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onLogout}
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                            <Button size="sm">
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;