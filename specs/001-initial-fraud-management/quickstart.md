# Quickstart Guide: Initial Fraud Management UI Implementation

**Feature**: Initial Fraud Management UI Implementation  
**Date**: October 22, 2025  
**Phase**: Phase 1 - Implementation Ready

## Overview

This quickstart guide provides step-by-step instructions for implementing the initial fraud management UI. The implementation creates a single-page React application that enables bank staff to submit transaction details and receive fraud risk assessments.

## Prerequisites

### Development Environment

- Node.js 20.x LTS installed
- pnpm package manager
- Git for version control
- VS Code with recommended extensions

### Knowledge Requirements

- React 18.x and TypeScript 5.x proficiency
- Next.js 14.x framework familiarity
- Form handling and validation experience
- REST API integration knowledge

## Quick Setup

### 1. Initialize Project Structure

```bash
# Navigate to project root
cd sdd-globobank-fraud-management-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 2. Environment Configuration

Create `.env.local` file in project root:

```env
# Fraud Detection Service API
NEXT_PUBLIC_FRAUD_API_URL=http://localhost:8080/fraud/v1
NEXT_PUBLIC_API_TIMEOUT=5000

# Application Configuration
NEXT_PUBLIC_APP_NAME=GloboBank Fraud Management
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 3. Core Dependencies Installation

```bash
# Core React and Next.js (if not already included)
pnpm add react@^18.2.0 react-dom@^18.2.0 next@^14.0.0

# TypeScript and types
pnpm add -D typescript @types/react @types/react-dom @types/node

# Form management and validation
pnpm add react-hook-form zod @hookform/resolvers

# API integration
pnpm add axios react-query @tanstack/react-query

# UI and styling
pnpm add @globobank/design-system react-input-mask

# Testing
pnpm add -D jest @testing-library/react @testing-library/jest-dom
pnpm add -D cypress @testing-library/cypress axe-core @axe-core/react

# Development tools
pnpm add -D eslint prettier husky lint-staged
```

## Implementation Steps

### Step 1: Create Core Components

#### 1.1 Main Fraud Verification Page

Create `src/pages/index.tsx`:

```typescript
import { FraudVerificationForm } from '../components/forms/FraudVerificationForm';
import { Layout } from '../components/layout/Layout';

export default function FraudManagementPage() {
  return (
    <Layout>
      <main>
        <h1>GloboBank Fraud Management</h1>
        <FraudVerificationForm />
      </main>
    </Layout>
  );
}
```

#### 1.2 Fraud Verification Form Component

Create `src/components/forms/FraudVerificationForm.tsx`:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fraudAssessmentSchema } from '../../utils/validation';
import { useFraudAssessment } from '../../hooks/useFraudAssessment';

// Component implementation following constitutional requirements
// - WCAG 2.1 AA accessibility compliance
// - Credit card masking during input
// - Real-time validation feedback
// - Loading states and error handling
```

### Step 2: Implement Data Layer

#### 2.1 API Service

Create `src/services/fraudApi.ts`:

```typescript
import axios from 'axios';
import { FraudAssessmentRequest, FraudAssessmentResponse } from './types';

const fraudApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRAUD_API_URL,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '5000'),
});

export const submitFraudAssessment = async (
  request: FraudAssessmentRequest
): Promise<FraudAssessmentResponse> => {
  // Implementation with error handling, retry logic, and logging
};
```

#### 2.2 Custom Hooks

Create `src/hooks/useFraudAssessment.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import { submitFraudAssessment } from '../services/fraudApi';

export const useFraudAssessment = () => {
  // React Query integration for API state management
  // Error handling and caching implementation
};
```

### Step 3: Validation and Security

#### 3.1 Input Validation

Create `src/utils/validation.ts`:

```typescript
import { z } from 'zod';

// UUID validation schema
export const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  'Transaction ID must be valid UUID format'
);

// Credit card validation with Luhn algorithm
export const creditCardSchema = z.string()
  .regex(/^[0-9]{13,19}$/, 'Credit card must be 13-19 digits')
  .refine(validateLuhnAlgorithm, 'Invalid credit card number');

export const fraudAssessmentSchema = z.object({
  transactionId: uuidSchema,
  creditCardNumber: creditCardSchema,
});
```

#### 3.2 Credit Card Masking

Create `src/utils/cardMasking.ts`:

```typescript
export const maskCreditCard = (cardNumber: string): string => {
  // Implementation for real-time masking during input
  // Format: ****-****-****-1234
};

export const formatCreditCardInput = (value: string): string => {
  // Real-time formatting for user input
};
```

### Step 4: Testing Implementation

#### 4.1 Unit Tests Setup

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### 4.2 Component Tests

Create `src/components/forms/__tests__/FraudVerificationForm.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FraudVerificationForm } from '../FraudVerificationForm';

describe('FraudVerificationForm', () => {
  it('should validate transaction ID format', async () => {
    // TDD implementation following constitutional requirements
  });

  it('should mask credit card input', () => {
    // Credit card masking validation
  });

  it('should handle API errors gracefully', async () => {
    // Error handling validation
  });
});
```

### Step 5: Accessibility Implementation

#### 5.1 ARIA Labels and Screen Reader Support

```typescript
// Form accessibility implementation
<form aria-label="Fraud verification form">
  <fieldset>
    <legend>Transaction Details</legend>
    
    <label htmlFor="transactionId">
      Transaction ID
      <span aria-label="required">*</span>
    </label>
    <input
      id="transactionId"
      aria-describedby="transactionId-error"
      aria-invalid={!!errors.transactionId}
    />
    
    {errors.transactionId && (
      <div id="transactionId-error" role="alert">
        {errors.transactionId.message}
      </div>
    )}
  </fieldset>
</form>
```

#### 5.2 Keyboard Navigation

```typescript
// Keyboard event handlers for form navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
  if (event.key === 'Escape') {
    handleCancel();
  }
};
```

## Development Workflow

### 1. Test-Driven Development

```bash
# Write failing tests first
pnpm test --watch

# Implement component until tests pass
# Refactor while keeping tests green
```

### 2. Quality Gates

```bash
# Run all quality checks before commit
pnpm lint
pnpm type-check
pnpm test:coverage
pnpm test:e2e
pnpm accessibility:check
```

### 3. Performance Monitoring

```bash
# Check bundle size and performance
pnpm build
pnpm analyze

# Lighthouse audit for performance and accessibility
pnpm lighthouse
```

## Integration Points

### Fraud Detection Service Integration

- API Endpoint: `POST /fraud/v1/risk-assessments`
- Request Format: JSON with `transactionId` and `creditCardNumber`
- Response Format: JSON with `riskScore`, `fraudulent`, and `timestamp`
- Error Handling: Display generic messages, log details for support

### Design System Integration

- Import GloboBank Design System components
- Use design tokens for consistent styling
- Follow component patterns for form elements
- Maintain brand compliance across all UI elements

## Deployment Checklist

### Before Deployment

- [ ] All tests passing (unit, integration, e2e)
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] Performance budgets met (<3s load time, <5s TTI)
- [ ] Security scan completed (no XSS vulnerabilities)
- [ ] Design system compliance validated
- [ ] API integration tested with staging environment

### Production Environment

- [ ] Environment variables configured
- [ ] HTTPS enforced for fraud service communication
- [ ] Content Security Policy headers configured
- [ ] Error logging and monitoring set up
- [ ] Performance monitoring enabled

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Check fraud service availability and network configuration
2. **Validation Failures**: Verify UUID format and Luhn algorithm implementation
3. **Accessibility Issues**: Run automated axe-core tests and manual screen reader validation
4. **Performance Problems**: Analyze bundle size and implement code splitting if needed

### Debug Commands

```bash
# Debug API integration
curl -X POST http://localhost:8080/fraud/v1/risk-assessments \
  -H "Content-Type: application/json" \
  -d '{"transactionId":"550e8400-e29b-41d4-a716-446655440000","creditCardNumber":"4532015112830366"}'

# Debug accessibility
pnpm test:a11y

# Debug performance
pnpm dev --profile
```

This quickstart guide provides the foundation for implementing the fraud management UI according to constitutional requirements and integration specifications.
