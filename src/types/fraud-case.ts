// Types for fraud case management
export interface FraudCase {
    id: string;
    caseNumber: string;
    title: string;
    description: string;
    status: CaseStatus;
    priority: CasePriority;
    riskScore: number;
    assignedTo?: string; // User ID
    assignedToName?: string; // User display name
    createdBy: string;
    createdByName: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    transactionIds: string[];
    estimatedLoss: number;
    actualLoss?: number;
    category: FraudCategory;
    tags: string[];
    notes: CaseNote[];
    attachments: CaseAttachment[];
}

export enum CaseStatus {
    PENDING = 'PENDING',
    INVESTIGATING = 'INVESTIGATING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    ESCALATED = 'ESCALATED'
}

export enum CasePriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum FraudCategory {
    IDENTITY_THEFT = 'IDENTITY_THEFT',
    CARD_FRAUD = 'CARD_FRAUD',
    ACCOUNT_TAKEOVER = 'ACCOUNT_TAKEOVER',
    WIRE_FRAUD = 'WIRE_FRAUD',
    CHECK_FRAUD = 'CHECK_FRAUD',
    ONLINE_BANKING_FRAUD = 'ONLINE_BANKING_FRAUD',
    PHISHING = 'PHISHING',
    SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING',
    OTHER = 'OTHER'
}

export interface CaseNote {
    id: string;
    caseId: string;
    content: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    isInternal: boolean;
}

export interface CaseAttachment {
    id: string;
    caseId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedBy: string;
    uploadedByName: string;
    uploadedAt: string;
    url: string;
}

// API Request/Response types
export interface CreateCaseRequest {
    title: string;
    description: string;
    priority: CasePriority;
    customerId: string;
    customerName: string;
    customerEmail: string;
    transactionIds: string[];
    estimatedLoss: number;
    category: FraudCategory;
    tags: string[];
}

export interface UpdateCaseRequest {
    title?: string;
    description?: string;
    status?: CaseStatus;
    priority?: CasePriority;
    assignedTo?: string;
    actualLoss?: number;
    tags?: string[];
}

export interface CaseFilters {
    status?: CaseStatus[];
    priority?: CasePriority[];
    category?: FraudCategory[];
    assignedTo?: string[];
    createdBy?: string[];
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    riskScoreRange?: {
        min: number;
        max: number;
    };
    search?: string;
}

export interface CaseListResponse {
    cases: FraudCase[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

// Utility types for case status transitions
export const CASE_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
    [CaseStatus.PENDING]: [CaseStatus.INVESTIGATING, CaseStatus.CLOSED],
    [CaseStatus.INVESTIGATING]: [CaseStatus.UNDER_REVIEW, CaseStatus.ESCALATED, CaseStatus.RESOLVED],
    [CaseStatus.UNDER_REVIEW]: [CaseStatus.INVESTIGATING, CaseStatus.RESOLVED, CaseStatus.ESCALATED],
    [CaseStatus.RESOLVED]: [CaseStatus.CLOSED, CaseStatus.INVESTIGATING],
    [CaseStatus.ESCALATED]: [CaseStatus.INVESTIGATING, CaseStatus.UNDER_REVIEW],
    [CaseStatus.CLOSED]: [] // Terminal state
};

// Display helpers
export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
    [CaseStatus.PENDING]: 'Pending',
    [CaseStatus.INVESTIGATING]: 'Investigating',
    [CaseStatus.UNDER_REVIEW]: 'Under Review',
    [CaseStatus.RESOLVED]: 'Resolved',
    [CaseStatus.CLOSED]: 'Closed',
    [CaseStatus.ESCALATED]: 'Escalated'
};

export const CASE_PRIORITY_LABELS: Record<CasePriority, string> = {
    [CasePriority.LOW]: 'Low',
    [CasePriority.MEDIUM]: 'Medium',
    [CasePriority.HIGH]: 'High',
    [CasePriority.CRITICAL]: 'Critical'
};

export const FRAUD_CATEGORY_LABELS: Record<FraudCategory, string> = {
    [FraudCategory.IDENTITY_THEFT]: 'Identity Theft',
    [FraudCategory.CARD_FRAUD]: 'Card Fraud',
    [FraudCategory.ACCOUNT_TAKEOVER]: 'Account Takeover',
    [FraudCategory.WIRE_FRAUD]: 'Wire Fraud',
    [FraudCategory.CHECK_FRAUD]: 'Check Fraud',
    [FraudCategory.ONLINE_BANKING_FRAUD]: 'Online Banking Fraud',
    [FraudCategory.PHISHING]: 'Phishing',
    [FraudCategory.SOCIAL_ENGINEERING]: 'Social Engineering',
    [FraudCategory.OTHER]: 'Other'
};

// Color schemes for UI
export const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
    [CaseStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [CaseStatus.INVESTIGATING]: 'bg-blue-100 text-blue-800',
    [CaseStatus.UNDER_REVIEW]: 'bg-purple-100 text-purple-800',
    [CaseStatus.RESOLVED]: 'bg-green-100 text-green-800',
    [CaseStatus.CLOSED]: 'bg-gray-100 text-gray-800',
    [CaseStatus.ESCALATED]: 'bg-red-100 text-red-800'
};

export const CASE_PRIORITY_COLORS: Record<CasePriority, string> = {
    [CasePriority.LOW]: 'bg-green-100 text-green-800',
    [CasePriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [CasePriority.HIGH]: 'bg-orange-100 text-orange-800',
    [CasePriority.CRITICAL]: 'bg-red-100 text-red-800'
};