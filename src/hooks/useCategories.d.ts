import { Category } from '../types';
export declare const useCategories: () => {
    categories: Category[];
    loading: boolean;
    error: string;
    addCategory: (category: Omit<Category, "id">) => Promise<{
        id: string;
        color: string;
        order: number;
        name: string;
        userId: string;
    }>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    refreshCategories: () => Promise<void>;
};
