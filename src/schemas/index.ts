import { z } from 'zod';
import { Priority, RiskLevel, FraudCaseStatus, TransactionType } from '@/types';

/**
 * Common validation schemas
 */
export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z.string().regex(
    /^\+?[\d\s\-\(\)]+$/,
    'Please enter a valid phone number'
);

export const amountSchema = z.number().positive('Amount must be positive');

export const dateSchema = z.date();

/**
 * Fraud Case Creation Schema
 */
export const createFraudCaseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
    priority: z.nativeEnum(Priority),
    riskLevel: z.nativeEnum(RiskLevel),
    customerId: z.string().min(1, 'Customer ID is required'),
    transactionIds: z.array(z.string()).optional(),
    assignedTo: z.string().optional(),
    tags: z.array(z.string()).optional(),
}); export type CreateFraudCaseInput = z.infer<typeof createFraudCaseSchema>;

/**
 * Fraud Case Update Schema
 */
export const updateFraudCaseSchema = z.object({
    id: z.string().min(1, 'Case ID is required'),
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters').optional(),
    status: z.nativeEnum(FraudCaseStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
    assignedTo: z.string().optional(),
    tags: z.array(z.string()).optional(),
    resolution: z.string().max(1000, 'Resolution must be less than 1000 characters').optional(),
});

export type UpdateFraudCaseInput = z.infer<typeof updateFraudCaseSchema>;

/**
 * Customer Search Schema
 */
export const customerSearchSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
    filters: z.object({
        riskLevel: z.nativeEnum(RiskLevel).optional(),
        hasActiveCases: z.boolean().optional(),
        registrationDateFrom: z.date().optional(),
        registrationDateTo: z.date().optional(),
    }).optional(),
});

export type CustomerSearchInput = z.infer<typeof customerSearchSchema>;

/**
 * Transaction Search Schema
 */
export const transactionSearchSchema = z.object({
    customerId: z.string().optional(),
    amountFrom: amountSchema.optional(),
    amountTo: amountSchema.optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
    type: z.nativeEnum(TransactionType).optional(),
    flaggedOnly: z.boolean().optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
});

export type TransactionSearchInput = z.infer<typeof transactionSearchSchema>;

/**
 * Customer Profile Update Schema
 */
export const updateCustomerProfileSchema = z.object({
    id: z.string().min(1, 'Customer ID is required'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters').optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export type UpdateCustomerProfileInput = z.infer<typeof updateCustomerProfileSchema>;

/**
 * Case Assignment Schema
 */
export const assignCaseSchema = z.object({
    caseId: z.string().min(1, 'Case ID is required'),
    assignedTo: z.string().min(1, 'Assignee is required'),
    comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
});

export type AssignCaseInput = z.infer<typeof assignCaseSchema>;

/**
 * Case Resolution Schema
 */
export const resolveCaseSchema = z.object({
    caseId: z.string().min(1, 'Case ID is required'),
    resolution: z.string().min(10, 'Resolution must be at least 10 characters').max(1000, 'Resolution must be less than 1000 characters'),
    actionsTaken: z.array(z.string()).min(1, 'At least one action must be specified'),
    followUpRequired: z.boolean(),
    followUpDate: z.date().optional(),
});

export type ResolveCaseInput = z.infer<typeof resolveCaseSchema>;

/**
 * Login Schema
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Form field validation helpers
 */
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): string | null => {
    try {
        schema.parse(value);
        return null;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return error.issues[0]?.message || 'Invalid value';
        }
        return 'Validation error';
    }
};