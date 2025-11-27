// Currency configuration
export const CURRENCIES = {
    NGN: { symbol: '₦', code: 'NGN', name: 'Nigerian Naira' },
    USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const DEFAULT_CURRENCY: CurrencyCode = 'NGN';

// Format currency based on user's selected currency
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'NGN'): string {
    const currency = CURRENCIES[currencyCode];
    return `${currency.symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
