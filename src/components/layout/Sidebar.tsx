import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/utils/helpers';

interface SidebarItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string | number;
}

interface SidebarProps {
    className?: string;
    items?: SidebarItem[];
    collapsed?: boolean;
    onToggle?: () => void;
}

const defaultItems: SidebarItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
            </svg>
        ),
    },
    {
        id: 'fraud-cases',
        label: 'Fraud Cases',
        href: '/fraud-cases',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        ),
        badge: '24',
    },
    {
        id: 'transactions',
        label: 'Transactions',
        href: '/transactions',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
        ),
    },
    {
        id: 'customers',
        label: 'Customers',
        href: '/customers',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
        ),
    },
    {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

const Sidebar: React.FC<SidebarProps> = ({
    className,
    items = defaultItems,
    collapsed = false,
    onToggle
}) => {
    const router = useRouter();

    return (
        <div className={cn(
            'bg-white border-r border-gray-200 transition-all duration-300',
            collapsed ? 'w-16' : 'w-64',
            className
        )}>
            {/* Toggle Button */}
            {onToggle && (
                <div className="flex justify-end p-4">
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                            />
                        </svg>
                    </button>
                </div>
            )}

            {/* Navigation Items */}
            <nav className="mt-4 px-2">
                <ul className="space-y-2">
                    {items.map((item) => {
                        const isActive = router.pathname === item.href;

                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                        collapsed && 'justify-center'
                                    )}
                                >
                                    {item.icon && (
                                        <span className={cn('flex-shrink-0', !collapsed && 'mr-3')}>
                                            {item.icon}
                                        </span>
                                    )}

                                    {!collapsed && (
                                        <>
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;