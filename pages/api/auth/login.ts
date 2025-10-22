import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRole, User } from '@/types';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    user: User;
    token: string;
    message: string;
}

// Simple hardcoded credentials
const HARDCODED_CREDENTIALS = {
    username: 'analyst',
    password: 'password123'
};

const HARDCODED_USER: User = {
    id: 'user-1',
    email: 'analyst@globobank.com',
    firstName: 'John',
    lastName: 'Analyst',
    role: UserRole.FRAUD_ANALYST,
    department: 'Fraud Prevention',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password }: LoginRequest = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Check hardcoded credentials (username can be email or just "analyst")
        if ((email === HARDCODED_CREDENTIALS.username || email === HARDCODED_USER.email)
            && password === HARDCODED_CREDENTIALS.password) {

            // Generate simple token
            const token = `simple-token-${Date.now()}`;

            return res.status(200).json({
                user: HARDCODED_USER,
                token,
                message: 'Login successful'
            });
        } else {
            return res.status(401).json({
                message: 'Invalid credentials. Use username: "analyst" and password: "password123"'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}