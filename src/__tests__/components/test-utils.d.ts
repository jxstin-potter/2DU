import React from 'react';
declare const customRender: (ui: React.ReactElement, options?: {}) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
export declare const mockTasks: {
    id: string;
    title: string;
    description: string;
    status: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    category: string;
    categoryId: string;
    tags: any[];
    subtasks: any[];
    attachments: any[];
}[];
export declare const mockCategories: {
    id: string;
    name: string;
    order: number;
}[];
export declare const mockTags: {
    id: string;
    name: string;
    color: string;
}[];
export * from '@testing-library/react';
export { customRender as render };
