import {
    FraudCase,
    CaseStatus,
    CasePriority,
    FraudCategory,
    CaseNote,
    CaseAttachment
} from '@/types/fraud-case';

// Mock fraud cases data
export const mockFraudCases: FraudCase[] = [
    {
        id: 'case-001',
        caseNumber: 'FC-2024-001',
        title: 'Suspicious Credit Card Transactions - Multiple Locations',
        description: 'Customer reported unauthorized transactions on their credit card across multiple geographic locations within a short time frame. Transactions include gas stations, ATM withdrawals, and online purchases.',
        status: CaseStatus.INVESTIGATING,
        priority: CasePriority.HIGH,
        riskScore: 85,
        assignedTo: 'user-analyst-001',
        assignedToName: 'Jane Smith',
        createdBy: 'user-manager-001',
        createdByName: 'Mike Johnson',
        createdAt: '2024-01-15T09:30:00Z',
        updatedAt: '2024-01-16T14:22:00Z',
        customerId: 'cust-001',
        customerName: 'John Anderson',
        customerEmail: 'j.anderson@email.com',
        transactionIds: ['txn-001', 'txn-002', 'txn-003', 'txn-004'],
        estimatedLoss: 2450.00,
        category: FraudCategory.CARD_FRAUD,
        tags: ['multiple-locations', 'high-velocity', 'international'],
        notes: [
            {
                id: 'note-001',
                caseId: 'case-001',
                content: 'Customer called to report suspicious activity. Confirmed they were not traveling and did not make these transactions.',
                createdBy: 'user-manager-001',
                createdByName: 'Mike Johnson',
                createdAt: '2024-01-15T09:45:00Z',
                isInternal: false
            },
            {
                id: 'note-002',
                caseId: 'case-001',
                content: 'Initial investigation shows transactions in New York, Florida, and California within 2-hour window. Flagging for immediate review.',
                createdBy: 'user-analyst-001',
                createdByName: 'Jane Smith',
                createdAt: '2024-01-16T10:15:00Z',
                isInternal: true
            }
        ],
        attachments: [
            {
                id: 'att-001',
                caseId: 'case-001',
                fileName: 'transaction_report.pdf',
                fileSize: 245760,
                fileType: 'application/pdf',
                uploadedBy: 'user-analyst-001',
                uploadedByName: 'Jane Smith',
                uploadedAt: '2024-01-16T11:30:00Z',
                url: '/api/attachments/att-001'
            }
        ]
    },
    {
        id: 'case-002',
        caseNumber: 'FC-2024-002',
        title: 'Account Takeover - Unusual Login Patterns',
        description: 'Customer account shows signs of compromise with login attempts from multiple IP addresses and password changes without customer authorization.',
        status: CaseStatus.UNDER_REVIEW,
        priority: CasePriority.CRITICAL,
        riskScore: 92,
        assignedTo: 'user-analyst-002',
        assignedToName: 'David Wilson',
        createdBy: 'user-admin-001',
        createdByName: 'Sarah Parker',
        createdAt: '2024-01-14T16:20:00Z',
        updatedAt: '2024-01-16T09:15:00Z',
        customerId: 'cust-002',
        customerName: 'Emily Rodriguez',
        customerEmail: 'e.rodriguez@email.com',
        transactionIds: ['txn-005', 'txn-006', 'txn-007'],
        estimatedLoss: 15000.00,
        actualLoss: 12500.00,
        category: FraudCategory.ACCOUNT_TAKEOVER,
        tags: ['account-compromise', 'password-change', 'multiple-ips'],
        notes: [
            {
                id: 'note-003',
                caseId: 'case-002',
                content: 'Security team detected unusual login patterns. Customer confirmed they did not change password or access account from reported locations.',
                createdBy: 'user-admin-001',
                createdByName: 'Sarah Parker',
                createdAt: '2024-01-14T16:30:00Z',
                isInternal: true
            },
            {
                id: 'note-004',
                caseId: 'case-002',
                content: 'Wire transfer of $12,500 was initiated. Working with receiving bank to potentially reverse transaction.',
                createdBy: 'user-analyst-002',
                createdByName: 'David Wilson',
                createdAt: '2024-01-15T14:20:00Z',
                isInternal: true
            }
        ],
        attachments: [
            {
                id: 'att-002',
                caseId: 'case-002',
                fileName: 'login_audit.xlsx',
                fileSize: 123456,
                fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                uploadedBy: 'user-analyst-002',
                uploadedByName: 'David Wilson',
                uploadedAt: '2024-01-15T15:45:00Z',
                url: '/api/attachments/att-002'
            }
        ]
    },
    {
        id: 'case-003',
        caseNumber: 'FC-2024-003',
        title: 'Phishing Attack - Email Compromise',
        description: 'Customer fell victim to phishing email and provided banking credentials. Subsequent unauthorized access detected.',
        status: CaseStatus.RESOLVED,
        priority: CasePriority.MEDIUM,
        riskScore: 65,
        assignedTo: 'user-analyst-001',
        assignedToName: 'Jane Smith',
        createdBy: 'user-analyst-001',
        createdByName: 'Jane Smith',
        createdAt: '2024-01-10T11:15:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        customerId: 'cust-003',
        customerName: 'Robert Chen',
        customerEmail: 'r.chen@email.com',
        transactionIds: ['txn-008', 'txn-009'],
        estimatedLoss: 850.00,
        actualLoss: 850.00,
        category: FraudCategory.PHISHING,
        tags: ['phishing', 'email-compromise', 'credential-theft'],
        notes: [
            {
                id: 'note-005',
                caseId: 'case-003',
                content: 'Customer reported clicking on suspicious email link and entering banking information. Immediate account security measures implemented.',
                createdBy: 'user-analyst-001',
                createdByName: 'Jane Smith',
                createdAt: '2024-01-10T11:30:00Z',
                isInternal: false
            },
            {
                id: 'note-006',
                caseId: 'case-003',
                content: 'Case resolved. Customer reimbursed for fraudulent transactions. Security training provided.',
                createdBy: 'user-analyst-001',
                createdByName: 'Jane Smith',
                createdAt: '2024-01-14T16:45:00Z',
                isInternal: false
            }
        ],
        attachments: []
    },
    {
        id: 'case-004',
        caseNumber: 'FC-2024-004',
        title: 'Check Fraud - Forged Signature',
        description: 'Business customer reported forged checks being cashed against their account with altered payee information.',
        status: CaseStatus.PENDING,
        priority: CasePriority.HIGH,
        riskScore: 78,
        createdBy: 'user-manager-001',
        createdByName: 'Mike Johnson',
        createdAt: '2024-01-16T13:20:00Z',
        updatedAt: '2024-01-16T13:20:00Z',
        customerId: 'cust-004',
        customerName: 'ABC Manufacturing Inc.',
        customerEmail: 'accounting@abcmfg.com',
        transactionIds: ['txn-010', 'txn-011', 'txn-012'],
        estimatedLoss: 8500.00,
        category: FraudCategory.CHECK_FRAUD,
        tags: ['forged-signature', 'business-account', 'altered-payee'],
        notes: [
            {
                id: 'note-007',
                caseId: 'case-004',
                content: 'Business customer reported three checks with forged signatures. Original checks were for $500, $1200, and $800 but cashed amounts were $2500, $3200, and $2800.',
                createdBy: 'user-manager-001',
                createdByName: 'Mike Johnson',
                createdAt: '2024-01-16T13:25:00Z',
                isInternal: false
            }
        ],
        attachments: []
    },
    {
        id: 'case-005',
        caseNumber: 'FC-2024-005',
        title: 'Wire Transfer Fraud - Social Engineering',
        description: 'Business customer was socially engineered into authorizing fraudulent wire transfer to overseas account.',
        status: CaseStatus.ESCALATED,
        priority: CasePriority.CRITICAL,
        riskScore: 95,
        assignedTo: 'user-admin-001',
        assignedToName: 'Sarah Parker',
        createdBy: 'user-analyst-002',
        createdByName: 'David Wilson',
        createdAt: '2024-01-12T14:30:00Z',
        updatedAt: '2024-01-16T08:45:00Z',
        customerId: 'cust-005',
        customerName: 'TechStart Solutions',
        customerEmail: 'finance@techstart.com',
        transactionIds: ['txn-013'],
        estimatedLoss: 45000.00,
        actualLoss: 45000.00,
        category: FraudCategory.SOCIAL_ENGINEERING,
        tags: ['social-engineering', 'wire-fraud', 'business-email-compromise', 'international'],
        notes: [
            {
                id: 'note-008',
                caseId: 'case-005',
                content: 'Customer received email appearing to be from CEO requesting urgent wire transfer. Finance team followed normal procedures but email was spoofed.',
                createdBy: 'user-analyst-002',
                createdByName: 'David Wilson',
                createdAt: '2024-01-12T15:00:00Z',
                isInternal: false
            },
            {
                id: 'note-009',
                caseId: 'case-005',
                content: 'Escalating to FBI due to international wire fraud. Working with international banking partners for recovery.',
                createdBy: 'user-admin-001',
                createdByName: 'Sarah Parker',
                createdAt: '2024-01-16T08:45:00Z',
                isInternal: true
            }
        ],
        attachments: []
    }
];

// Mock users for assignment
export const mockUsers = [
    { id: 'user-admin-001', name: 'Sarah Parker', role: 'ADMIN' },
    { id: 'user-manager-001', name: 'Mike Johnson', role: 'MANAGER' },
    { id: 'user-analyst-001', name: 'Jane Smith', role: 'ANALYST' },
    { id: 'user-analyst-002', name: 'David Wilson', role: 'ANALYST' }
];

// Helper function to get case by ID
export const getCaseById = (id: string): FraudCase | undefined => {
    return mockFraudCases.find(fraudCase => fraudCase.id === id);
};

// Helper function to get cases by status
export const getCasesByStatus = (status: CaseStatus): FraudCase[] => {
    return mockFraudCases.filter(fraudCase => fraudCase.status === status);
};

// Helper function to get cases assigned to user
export const getCasesByAssignee = (userId: string): FraudCase[] => {
    return mockFraudCases.filter(fraudCase => fraudCase.assignedTo === userId);
};

// Helper function to get high priority cases
export const getHighPriorityCases = (): FraudCase[] => {
    return mockFraudCases.filter(
        fraudCase => fraudCase.priority === CasePriority.HIGH || fraudCase.priority === CasePriority.CRITICAL
    );
};