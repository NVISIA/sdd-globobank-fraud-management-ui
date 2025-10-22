import React, { useState } from 'react';
import { cn } from '@/utils/helpers';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
    showSidebar?: boolean;
    user?: {
        name: string;
        email: string;
        role: string;
    };
    onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    className,
    showSidebar = true,
    user,
    onLogout,
}) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header user={user} onLogout={onLogout} />

            {/* Main Content Area */}
            <div className="flex">
                {/* Sidebar */}
                {showSidebar && (
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggle={toggleSidebar}
                    />
                )}

                {/* Main Content */}
                <main className={cn(
                    'flex-1 min-h-[calc(100vh-4rem)]',
                    className
                )}>
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;