# Data Model: Initial Fraud Management UI Implementation

**Feature**: Initial Fraud Management UI Implementation  
**Date**: October 22, 2025  
**Phase**: Phase 1 - Design & Contracts

## Entity Overview

This document defines the data structures and validation rules for the fraud management UI, aligned with the fraud detection service API contracts.

## Core Entities

### TransactionVerificationRequest

Represents the user input data for fraud verification submission.

**Entity Definition**:

```typescript
interface TransactionVerificationRequest {
  transactionId: string;    // UUID format required
  creditCardNumber: string; // 13-19 digits, will be masked in UI
}
```

**Validation Rules**:

- `transactionId`: Must match UUID v4 format pattern (`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)
- `creditCardNumber`: Must be 13-19 numeric digits only, must pass Luhn algorithm validation

**Business Rules**:

- Transaction ID is required and cannot be empty
- Credit card number is required and cannot be empty
- Credit card number is masked during input and after submission
- Both fields trigger real-time validation on input change

### FraudAssessmentResult

Represents the response data from the fraud detection service.

**Entity Definition**:

```typescript
interface FraudAssessmentResult {
  riskScore: number;        // 0-1000 scale (1000 = confirmed fraud)
  fraudulent: boolean;      // Binary determination (true when risk score > 1000)
  timestamp: string;        // ISO 8601 timestamp (UTC)
}
```

**Validation Rules**:

- `riskScore`: Must be integer between 0 and 1000 inclusive
- `fraudulent`: Boolean value derived from risk score
- `timestamp`: Must be valid ISO 8601 format

**Business Rules**:

- Risk score of 0 indicates clean transaction (not in fraudulent database)
- Risk score of 1000 indicates confirmed fraudulent card
- Fraudulent flag is true when risk score exceeds 1000
- Results remain visible until user manually clears or submits new request

### FormValidationState

Tracks the current validation status and user interaction state.

**Entity Definition**:

```typescript
interface FormValidationState {
  isValid: boolean;
  errors: ValidationErrors;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

interface ValidationErrors {
  transactionId?: string;
  creditCardNumber?: string;
  general?: string;
}
```

**State Transitions**:

- Initial: `isValid: false, errors: {}, isSubmitting: false, hasSubmitted: false`
- Validating: Real-time validation updates `isValid` and `errors` on input change
- Submitting: `isSubmitting: true` while API request in progress
- Success: `hasSubmitted: true, isSubmitting: false` with cleared errors
- Error: `isSubmitting: false` with populated error messages

### ApiErrorResponse

Represents error responses from the fraud detection service.

**Entity Definition**:

```typescript
interface ApiErrorResponse {
  error: ErrorType;
  message: string;
  timestamp: string;
  correlationId: string;
}

type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';
```

**Error Handling Rules**:

- `VALIDATION_ERROR`: Display field-specific error messages to user
- `SERVICE_UNAVAILABLE`: Display generic error message, log details for support
- `INTERNAL_ERROR`: Display generic error message, log correlation ID
- Other errors: Display appropriate user-friendly messages

### UserSession

Maintains interface state and interaction context for audit logging.

**Entity Definition**:

```typescript
interface UserSession {
  sessionId: string;
  startTime: string;
  interactions: UserInteraction[];
  currentRequest?: TransactionVerificationRequest;
  currentResult?: FraudAssessmentResult;
}

interface UserInteraction {
  action: 'form_input' | 'form_submit' | 'result_view' | 'error_encounter';
  timestamp: string;
  metadata?: Record<string, any>;
}
```

**Lifecycle Rules**:

- Session starts when user loads the fraud verification page
- Interactions are logged for audit trail (constitutional requirement)
- Session data is cleared when user navigates away or refreshes page
- No sensitive data (credit card numbers) stored in session state

## Data Flow Relationships

### Input Flow

1. User enters `TransactionVerificationRequest` data
2. Real-time validation updates `FormValidationState`
3. Valid submission creates API request to fraud service
4. Response populates `FraudAssessmentResult` or `ApiErrorResponse`

### State Management

- Form state managed by React Hook Form
- API state managed by React Query for caching and error handling
- UI state (loading, errors) managed by local component state
- Session data managed by custom React hook

### Data Persistence

- No client-side persistence of sensitive data (constitutional requirement)
- Session interactions logged to audit trail
- API responses cached temporarily for performance (non-sensitive data only)

## Validation Implementation

### Client-Side Validation

```typescript
// UUID validation
const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// Credit card validation (Luhn algorithm)
function validateCreditCard(cardNumber: string): boolean {
  // Remove non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Check length (13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm implementation
  // [Implementation details in actual code]
}
```

### Server-Side Integration

- Client validation mirrors fraud service API schema validation
- Server validates all inputs before processing (defense in depth)
- API contract ensures type safety with fraud detection service

## Security Considerations

### Data Protection

- Credit card numbers masked using format: `****-****-****-1234`
- No sensitive data stored in browser localStorage or sessionStorage
- API requests use HTTPS for data transmission
- Input sanitization prevents XSS attacks

### Audit Trail

- All user interactions logged with timestamps
- API requests/responses logged for compliance
- Error details logged for support investigation
- No sensitive data included in client-side logs

This data model provides the foundation for implementing the fraud management UI with proper validation, security, and integration with the fraud detection service API.
