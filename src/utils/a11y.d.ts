/**
 * Creates an accessible label for an element
 */
export declare const createAccessibleLabel: (id: string, label: string) => {
    'aria-label': string;
    id: string;
};
/**
 * Creates an accessible description for an element
 */
export declare const createAccessibleDescription: (id: string, description: string) => {
    'aria-describedby': string;
    id: string;
    description: {
        id: string;
        text: string;
    };
};
/**
 * Creates accessible props for a button
 */
export declare const createAccessibleButton: (id: string, label: string, onClick: (e: React.MouseEvent) => void, description?: string) => any;
/**
 * Creates accessible props for a checkbox
 */
export declare const createAccessibleCheckbox: (id: string, label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, description?: string) => any;
/**
 * Creates accessible props for a select element
 */
export declare const createAccessibleSelect: (id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: Array<{
    value: string;
    label: string;
}>, description?: string) => {
    selectProps: any;
    options: {
        value: string;
        label: string;
    }[];
};
