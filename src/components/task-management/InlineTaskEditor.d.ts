import React from 'react';
import { Task, Category } from '../../types';
interface InlineTaskEditorProps {
    onSubmit: (taskData: Partial<Task>) => Promise<void>;
    onCancel: () => void;
    initialTask?: Task | null;
    autoFocus?: boolean;
    categories?: Category[];
    defaultCategoryId?: string;
}
declare const InlineTaskEditor: React.FC<InlineTaskEditorProps>;
export default InlineTaskEditor;
