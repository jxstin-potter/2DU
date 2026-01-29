import React, { ReactNode } from 'react';
export interface RecentView {
    path: string;
    labelKey: string;
    icon: 'today' | 'completed' | 'settings';
}
interface SearchModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    recentViews: RecentView[];
    recordRecentView: (path: string) => void;
}
export declare const SearchModalProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useSearchModal: () => SearchModalContextType;
export {};
