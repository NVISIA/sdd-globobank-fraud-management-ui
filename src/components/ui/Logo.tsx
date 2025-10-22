import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
};

export const GloboBankLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
    return (
        <div className={`${sizeClasses[size]} ${className} relative`}>
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer circle with gradient */}
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* Main circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="url(#logoGradient)"
                    stroke="#1e40af"
                    strokeWidth="2"
                />

                {/* Inner geometric design representing global connectivity */}
                <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.3"
                />

                {/* Central "G" design */}
                <path
                    d="M35 35 L35 65 L55 65 L55 50 L45 50"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* Globe lines */}
                <path
                    d="M20 50 Q35 30, 50 50 Q65 70, 80 50"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.6"
                    fill="none"
                />
                <path
                    d="M20 50 Q35 70, 50 50 Q65 30, 80 50"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.6"
                    fill="none"
                />

                {/* Center dot */}
                <circle
                    cx="50"
                    cy="50"
                    r="3"
                    fill="#ffffff"
                />
            </svg>
        </div>
    );
};

export const GloboBankWordmark: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <GloboBankLogo size="md" />
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">
                    GloboBank
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">
                    Fraud Management
                </span>
            </div>
        </div>
    );
};