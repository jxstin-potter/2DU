import { Category } from '../types';
export declare const useCategories: () => {
    categories: Category[];
    loading: boolean;
    error: string;
    addCategory: (category: Omit<Category, "id">) => Promise<{
        id: string;
        name: string;
        userId: string;
        order: number;
        color: string;
    }>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    refreshCategories: () => Promise<void>;
};
