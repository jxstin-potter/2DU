export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
export declare const supportedLanguages: readonly [{
    readonly code: "en";
    readonly name: "English";
}, {
    readonly code: "es";
    readonly name: "Español";
}, {
    readonly code: "fr";
    readonly name: "Français";
}, {
    readonly code: "de";
    readonly name: "Deutsch";
}, {
    readonly code: "ja";
    readonly name: "日本語";
}, {
    readonly code: "zh";
    readonly name: "中文";
}];
export interface Translations {
    [key: string]: {
        [key: string]: string;
    };
}
export declare const DEFAULT_LANGUAGE: Language;
export declare const setLanguage: (language: Language) => void;
export declare const getLanguage: () => Language;
export declare const initLanguage: () => void;
export declare const t: (key: string, params?: Record<string, string>) => string;
export declare const formatDate: (date: Date | string, formatStr?: string) => string;
export declare const formatRelativeDate: (date: Date | string, baseDate?: Date) => string;
export declare const formatDistanceDate: (date: Date | string, baseDate?: Date) => string;
export declare const formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
export declare const formatCurrency: (amount: number, currency?: string) => string;
