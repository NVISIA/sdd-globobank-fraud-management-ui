import type { NextApiRequest, NextApiResponse } from 'next';
import { User, UserRole } from '@/types';

interface MeResponse {
    user: User;
}

// Mock function to verify token and get user
function verifyTokenAndGetUser(token: string): User | null {
    try {
        // In a real app, this would verify a JWT token
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());

        // Check if token is expired
        if (payload.exp < Date.now()) {
            return null;
        }

        // Mock user lookup by ID (in real app, query database)
        const mockUsers: Record<string, User> = {
            'user-1': {
                id: 'user-1',
                email: 'analyst@globobank.com',
                firstName: 'Jane',
                lastName: 'Smith',
                role: UserRole.FRAUD_ANALYST,
                department: 'Fraud Prevention',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                lastLoginAt: new Date().toISOString(),
            },
            'user-2': {
                id: 'user-2',
                email: 'manager@globobank.com',
                firstName: 'John',
                lastName: 'Johnson',
                role: UserRole.FRAUD_MANAGER,
                department: 'Fraud Prevention',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                lastLoginAt: new Date().toISOString(),
            },
            'user-3': {
                id: 'user-3',
                email: 'admin@globobank.com',
                firstName: 'Admin',
                lastName: 'User',
                role: UserRole.ADMIN,
                department: 'IT Administration',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                lastLoginAt: new Date().toISOString(),
            },
            'user-4': {
                id: 'user-4',
                email: 'senior@globobank.com',
                firstName: 'Sarah',
                lastName: 'Wilson',
                role: UserRole.SENIOR_ANALYST,
                department: 'Fraud Prevention',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                lastLoginAt: new Date().toISOString(),
            },
        };

        return mockUsers[payload.userId] || null;
    } catch {
        return null;
    }
} export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<MeResponse | { message: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const user = verifyTokenAndGetUser(token);

        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is disabled' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Me endpoint error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}