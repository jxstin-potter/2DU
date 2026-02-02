import { Tag } from '../types';
export declare const useTags: () => {
    tags: Tag[];
    loading: boolean;
    error: string;
    addTag: (tag: Omit<Tag, "id">) => Promise<{
        id: string;
        name: string;
        color: string;
    }>;
    updateTag: (id: string, updates: Partial<Tag>) => Promise<void>;
    deleteTag: (id: string) => Promise<void>;
    refreshTags: () => Promise<void>;
};
