// Re-export all types for easy importing
export * from './common';
export * from './fraud';
export * from './api';

// Type guards
export function isApiError(error: unknown): error is { response: { data: { message: string; code?: string } } } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        'data' in (error as any).response &&
        typeof (error as any).response.data === 'object' &&
        'message' in (error as any).response.data
    );
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Type utilities
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Event types for real-time updates
export interface WebSocketMessage {
    type: WebSocketMessageType;
    payload: unknown;
    timestamp: string;
}

export enum WebSocketMessageType {
    CASE_UPDATED = 'CASE_UPDATED',
    CASE_ASSIGNED = 'CASE_ASSIGNED',
    NEW_ALERT = 'NEW_ALERT',
    USER_ACTIVITY = 'USER_ACTIVITY',
    SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION'
}