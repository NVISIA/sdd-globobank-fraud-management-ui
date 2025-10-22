import { FraudCase, Transaction, Customer } from './fraud';
import { Priority, RiskLevel } from './common';

// API request types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface FraudCaseFilters {
    status?: string[];
    priority?: Priority[];
    riskLevel?: RiskLevel[];
    assignedTo?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    tags?: string[];
}

export interface TransactionFilters {
    customerId?: string;
    accountNumber?: string;
    transactionType?: string[];
    status?: string[];
    riskLevel?: RiskLevel[];
    amountMin?: number;
    amountMax?: number;
    dateFrom?: string;
    dateTo?: string;
    merchantCategory?: string;
    flaggedOnly?: boolean;
}

export interface CustomerSearchFilters {
    query?: string;
    riskScoreMin?: number;
    riskScoreMax?: number;
    kycStatus?: string[];
    highRiskOnly?: boolean;
    accountNumber?: string;
}

// Form types for fraud case management
export interface CreateFraudCaseRequest {
    customerId: string;
    transactionIds: string[];
    priority: Priority;
    description: string;
    reportedBy: string;
    tags?: string[];
}

export interface UpdateFraudCaseRequest {
    status?: string;
    priority?: Priority;
    assignedTo?: string;
    description?: string;
    tags?: string[];
}

export interface AddCaseNoteRequest {
    caseId: string;
    content: string;
    isInternal: boolean;
    attachments?: File[];
}

export interface EscalateCaseRequest {
    caseId: string;
    toUserId: string;
    reason: string;
}

export interface ResolveCaseRequest {
    caseId: string;
    outcome: string;
    reason: string;
    actionsTaken: string[];
    amountRecovered?: number;
    preventiveMeasures?: string[];
}

// Dashboard and analytics types
export interface DashboardStats {
    totalCases: number;
    pendingCases: number;
    casesUnderReview: number;
    resolvedCasesToday: number;
    totalAmountAtRisk: number;
    averageResolutionTime: number;
    criticalCases: number;
    myAssignedCases: number;
}

export interface CaseMetrics {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byRiskLevel: Record<string, number>;
    resolutionTrends: TimeSeriesData[];
    amountTrends: TimeSeriesData[];
}

export interface TimeSeriesData {
    date: string;
    value: number;
    label?: string;
}

export interface AlertSummary {
    id: string;
    type: AlertType;
    severity: Priority;
    message: string;
    count: number;
    timestamp: string;
    relatedCaseId?: string;
}

export enum AlertType {
    HIGH_RISK_TRANSACTION = 'HIGH_RISK_TRANSACTION',
    MULTIPLE_FAILED_LOGINS = 'MULTIPLE_FAILED_LOGINS',
    UNUSUAL_SPENDING_PATTERN = 'UNUSUAL_SPENDING_PATTERN',
    SUSPICIOUS_LOCATION = 'SUSPICIOUS_LOCATION',
    ACCOUNT_TAKEOVER = 'ACCOUNT_TAKEOVER',
    CARD_NOT_PRESENT = 'CARD_NOT_PRESENT'
}

// Search and pagination types
export interface SearchRequest {
    query: string;
    filters: Record<string, unknown>;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Bulk operations
export interface BulkAssignRequest {
    caseIds: string[];
    assignedTo: string;
}

export interface BulkStatusUpdateRequest {
    caseIds: string[];
    status: string;
    reason?: string;
}

export interface BulkExportRequest {
    caseIds?: string[];
    filters?: FraudCaseFilters;
    format: 'csv' | 'excel' | 'pdf';
    includeTransactions: boolean;
    includeNotes: boolean;
}

// Notification types
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    priority: Priority;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
}

export enum NotificationType {
    CASE_ASSIGNED = 'CASE_ASSIGNED',
    CASE_ESCALATED = 'CASE_ESCALATED',
    CASE_UPDATED = 'CASE_UPDATED',
    HIGH_RISK_ALERT = 'HIGH_RISK_ALERT',
    SYSTEM_ALERT = 'SYSTEM_ALERT',
    REMINDER = 'REMINDER'
}