/**
 * Currency utility functions for the fraud management system
 */

/**
 * Format an amount as currency
 */
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `${currency} ${amount.toFixed(2)}`;
    }
}

/**
 * Format amount for display in data tables (compact format for large numbers)
 */
export function formatCompactCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    try {
        if (Math.abs(amount) >= 1000000) {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 1,
            }).format(amount);
        }
        return formatCurrency(amount, currency, locale);
    } catch (error) {
        console.error('Error formatting compact currency:', error);
        return formatCurrency(amount, currency, locale);
    }
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(currencyString: string): number {
    try {
        // Remove currency symbols, commas, and spaces
        const cleaned = currencyString.replace(/[$,\s€£¥]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    } catch (error) {
        console.error('Error parsing currency:', error);
        return 0;
    }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value / 100);
    } catch (error) {
        console.error('Error formatting percentage:', error);
        return `${value.toFixed(decimals)}%`;
    }
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatNumber(num: number, decimals: number = 1): string {
    try {
        if (Math.abs(num) >= 1000000000) {
            return (num / 1000000000).toFixed(decimals) + 'B';
        } else if (Math.abs(num) >= 1000000) {
            return (num / 1000000).toFixed(decimals) + 'M';
        } else if (Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(decimals) + 'K';
        }
        return num.toString();
    } catch (error) {
        console.error('Error formatting number:', error);
        return num.toString();
    }
}

/**
 * Calculate risk amount based on transaction amount and risk level
 */
export function calculateRiskAmount(amount: number, riskScore: number): number {
    // Risk amount is a percentage of the transaction amount based on risk score
    const riskPercentage = Math.min(riskScore / 100, 1); // Normalize to 0-1
    return amount * riskPercentage;
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: 'C$',
        AUD: 'A$',
        CHF: 'CHF',
        CNY: '¥',
        INR: '₹',
    };

    return symbols[currency.toUpperCase()] || currency;
}

/**
 * Validate currency amount
 */
export function isValidAmount(amount: string | number): boolean {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Round amount to currency precision
 */
export function roundToCurrency(amount: number, currency: string = 'USD'): number {
    // Most currencies use 2 decimal places, but some like JPY use 0
    const precision = ['JPY', 'KRW', 'VND'].includes(currency.toUpperCase()) ? 0 : 2;
    return Math.round(amount * Math.pow(10, precision)) / Math.pow(10, precision);
}