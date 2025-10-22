import { BaseEntity, Priority, RiskLevel, FraudCaseStatus, User, TransactionStatus } from './common';

// Customer information
export interface Customer extends BaseEntity {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth: string;
    address: Address;
    accountNumbers: string[];
    riskScore: number;
    isHighRisk: boolean;
    kycStatus: KYCStatus;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export enum KYCStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

// Transaction types
export interface Transaction extends BaseEntity {
    transactionId: string;
    customerId: string;
    accountNumber: string;
    amount: number;
    currency: string;
    transactionType: TransactionType;
    description: string;
    merchantName?: string;
    merchantCategory?: string;
    location: TransactionLocation;
    timestamp: string;
    status: TransactionStatus;
    riskScore: number;
    riskLevel: RiskLevel;
    flaggedReasons: string[];
    isBlocked: boolean;
    processedBy?: string;
}

export enum TransactionType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
    TRANSFER = 'TRANSFER',
    WITHDRAWAL = 'WITHDRAWAL',
    DEPOSIT = 'DEPOSIT',
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND'
}

export interface TransactionLocation {
    country: string;
    city?: string;
    ipAddress?: string;
    deviceId?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

// Fraud case types
export interface FraudCase extends BaseEntity {
    caseId: string;
    customerId: string;
    customer: Customer;
    transactions: Transaction[];
    status: FraudCaseStatus;
    priority: Priority;
    riskLevel: RiskLevel;
    totalAmount: number;
    currency: string;
    description: string;
    assignedTo?: string;
    assignedAnalyst?: User;
    reportedBy: string;
    reportedAt: string;
    resolvedAt?: string;
    resolution?: CaseResolution;
    notes: CaseNote[];
    attachments: CaseAttachment[];
    tags: string[];
    escalationHistory: EscalationRecord[];
}

export interface CaseResolution {
    outcome: ResolutionOutcome;
    reason: string;
    actionsTaken: string[];
    amountRecovered?: number;
    preventiveMeasures?: string[];
    resolvedBy: string;
    resolvedAt: string;
}

export enum ResolutionOutcome {
    FRAUD_CONFIRMED = 'FRAUD_CONFIRMED',
    FALSE_POSITIVE = 'FALSE_POSITIVE',
    INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE',
    CUSTOMER_VERIFIED = 'CUSTOMER_VERIFIED',
    ACCOUNT_COMPROMISED = 'ACCOUNT_COMPROMISED',
    CARD_COMPROMISED = 'CARD_COMPROMISED'
}

export interface CaseNote extends BaseEntity {
    caseId: string;
    content: string;
    authorId: string;
    author: User;
    isInternal: boolean;
    attachments?: string[];
}

export interface CaseAttachment extends BaseEntity {
    caseId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    filePath: string;
    description?: string;
}

export interface EscalationRecord extends BaseEntity {
    caseId: string;
    fromUserId: string;
    toUserId: string;
    reason: string;
    escalatedAt: string;
    escalatedBy: User;
    escalatedTo: User;
}

// Investigation types
export interface Investigation extends BaseEntity {
    investigationId: string;
    caseId: string;
    investigatorId: string;
    investigator: User;
    status: InvestigationStatus;
    startedAt: string;
    completedAt?: string;
    findings: InvestigationFinding[];
    evidence: Evidence[];
    recommendedActions: string[];
    summary?: string;
}

export enum InvestigationStatus {
    INITIATED = 'INITIATED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ON_HOLD = 'ON_HOLD',
    CANCELLED = 'CANCELLED'
}

export interface InvestigationFinding {
    id: string;
    category: FindingCategory;
    description: string;
    severity: Priority;
    evidence: string[];
    recommendations: string[];
}

export enum FindingCategory {
    SUSPICIOUS_PATTERN = 'SUSPICIOUS_PATTERN',
    ANOMALOUS_BEHAVIOR = 'ANOMALOUS_BEHAVIOR',
    IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
    TECHNICAL_INDICATORS = 'TECHNICAL_INDICATORS',
    EXTERNAL_INTELLIGENCE = 'EXTERNAL_INTELLIGENCE'
}

export interface Evidence {
    id: string;
    type: EvidenceType;
    description: string;
    source: string;
    collectedAt: string;
    collectedBy: string;
    metadata: Record<string, unknown>;
}

export enum EvidenceType {
    TRANSACTION_LOG = 'TRANSACTION_LOG',
    CUSTOMER_COMMUNICATION = 'CUSTOMER_COMMUNICATION',
    SYSTEM_LOG = 'SYSTEM_LOG',
    EXTERNAL_DATA = 'EXTERNAL_DATA',
    SCREENSHOT = 'SCREENSHOT',
    DOCUMENT = 'DOCUMENT'
}