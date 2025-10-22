import React, { useState } from 'react';
import { NextPage } from 'next';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { GloboBankLogo } from '@/components/ui/Logo';
// Modern styling uses custom CSS classes instead of component library
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const fraudReportSchema = z.object({
    transactionId: z.string().min(1, 'Transaction ID is required'),
    creditCardNumber: z.string()
        .min(13, 'Credit card number must be at least 13 digits')
        .max(19, 'Credit card number must be at most 19 digits')
        .regex(/^\d+$/, 'Credit card number must contain only digits'),
    description: z.string().min(10, 'Please provide at least 10 characters describing the issue')
});

type FraudReportInput = z.infer<typeof fraudReportSchema>;

const DashboardPage: NextPage = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FraudReportInput>({
        resolver: zodResolver(fraudReportSchema)
    });

    const onSubmit = async (data: FraudReportInput) => {
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Fraud report submitted:', data);
            setSubmitMessage('Fraud report submitted successfully! Case ID: FR-' + Date.now());
            reset();
        } catch (error) {
            setSubmitMessage('Failed to submit fraud report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Transform user for header
    const headerUser = user ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role.replace('_', ' '),
    } : undefined;

    return (
        <ProtectedRoute>
            <Layout user={headerUser}>
                <div className="min-h-screen bg-gradient-subtle">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-blue-100 opacity-10"></div>
                        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-blue-200 opacity-10"></div>
                    </div>

                    <div className="relative max-w-4xl mx-auto pt-8 pb-12 px-4 space-y-8">
                        {/* Welcome Header */}
                        <div className="card-elevated p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <GloboBankLogo size="lg" />
                            </div>
                            <h1 className="heading-lg text-slate-900 mb-2">
                                Welcome back, {user?.firstName}!
                            </h1>
                            <p className="text-muted">
                                Report suspicious transactions using the form below.
                            </p>
                        </div>

                        {/* Fraud Report Form */}
                        <div className="card-elevated">
                            <div className="p-8">
                                <h2 className="heading-md text-slate-900 mb-6">Report Fraudulent Transaction</h2>

                                {submitMessage && (
                                    <div className={`p-4 rounded-lg mb-6 ${submitMessage.includes('successfully')
                                        ? 'status-success'
                                        : 'status-error'
                                        }`}>
                                        <div className="flex items-center">
                                            <svg className={`h-5 w-5 mr-3 ${submitMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                                {submitMessage.includes('successfully') ? (
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                ) : (
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                )}
                                            </svg>
                                            <span className="text-sm font-medium">{submitMessage}</span>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div>
                                        <label htmlFor="transactionId" className="block text-sm font-medium text-slate-700 mb-2">
                                            Transaction ID
                                        </label>
                                        <input
                                            id="transactionId"
                                            type="text"
                                            placeholder="Enter transaction ID (e.g., TXN123456789)"
                                            {...register('transactionId')}
                                            className={`input-modern ${errors.transactionId ? 'input-error' : ''}`}
                                        />
                                        {errors.transactionId && (
                                            <p className="mt-1 text-sm text-red-600">{errors.transactionId.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="creditCardNumber" className="block text-sm font-medium text-slate-700 mb-2">
                                            Credit Card Number
                                        </label>
                                        <input
                                            id="creditCardNumber"
                                            type="text"
                                            placeholder="Enter credit card number (digits only)"
                                            {...register('creditCardNumber')}
                                            className={`input-modern ${errors.creditCardNumber ? 'input-error' : ''}`}
                                        />
                                        {errors.creditCardNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.creditCardNumber.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-slate-500">
                                            Enter only the digits of the credit card number (no spaces or dashes)
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                            Description of Suspicious Activity
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="Describe the suspicious activity or unauthorized transaction..."
                                            {...register('description')}
                                            className={`input-modern resize-none ${errors.description ? 'input-error' : ''}`}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary w-full"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Fraud Report'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="card-elevated">
                            <div className="p-8">
                                <h3 className="heading-sm text-slate-900 mb-4">Current User</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-slate-700">Name:</span>
                                        <span className="text-sm text-slate-900">{user?.firstName} {user?.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-slate-700">Email:</span>
                                        <span className="text-sm text-slate-900">{user?.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-slate-700">Role:</span>
                                        <span className="text-sm text-slate-900">{user?.role.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-slate-700">Department:</span>
                                        <span className="text-sm text-slate-900">{user?.department}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default DashboardPage;