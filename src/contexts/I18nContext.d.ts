import React, { ReactNode } from 'react';
import { Language } from '../utils/i18n';
interface I18nContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, params?: Record<string, string>) => string;
    formatDate: (date: Date | string, formatStr?: string) => string;
    formatRelativeDate: (date: Date | string, baseDate?: Date) => string;
    formatDistanceDate: (date: Date | string, baseDate?: Date) => string;
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
    formatCurrency: (amount: number, currency?: string) => string;
}
declare const I18nContext: React.Context<I18nContextType>;
interface I18nProviderProps {
    children: ReactNode;
}
export declare const I18nProvider: React.FC<I18nProviderProps>;
export declare const useI18n: () => I18nContextType;
export default I18nContext;
