import { Task } from '../types';
import { TaskDocument } from '../types/firestore';
/**
 * Convert Firestore TaskDocument to app Task type (robust version)
 */
export declare const taskDocumentToTask: (doc: any) => Task;
/**
 * Parse time from natural language text and return the time and cleaned text
 * Supports formats like "3pm", "3 pm", "at 3pm", "3:00pm", "3am", etc.
 * @param text - The text to parse
 * @returns Object with time (Date for today at parsed time, or null) and cleanedText
 */
export declare const parseTimeFromText: (text: string) => {
    time: Date | null;
    cleanedText: string;
    matchInfo?: {
        start: number;
        end: number;
        text: string;
    };
};
/**
 * Convert app Task to Firestore TaskDocument (for creating/updating)
 */
export declare const taskToTaskDocument: (task: Partial<Task>) => Partial<TaskDocument>;
