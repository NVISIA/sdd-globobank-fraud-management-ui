// Base types for fraud management system

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// Status enums
export enum FraudCaseStatus {
    PENDING = 'PENDING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    INVESTIGATING = 'INVESTIGATING',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    ESCALATED = 'ESCALATED'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    SUSPICIOUS = 'SUSPICIOUS',
    BLOCKED = 'BLOCKED'
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum RiskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}

// User and authentication types
export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department?: string;
    isActive: boolean;
    lastLoginAt?: string;
}

export enum UserRole {
    FRAUD_ANALYST = 'FRAUD_ANALYST',
    SENIOR_ANALYST = 'SENIOR_ANALYST',
    FRAUD_MANAGER = 'FRAUD_MANAGER',
    ADMIN = 'ADMIN'
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}