import React from 'react';
interface HighlightedTimeInputProps {
    value: string;
    onChange: (value: string) => void;
    onTimeParsed?: (time: Date | null, matchInfo: {
        start: number;
        end: number;
        text: string;
    } | null) => void;
    label?: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    inputRef?: React.RefObject<HTMLDivElement>;
    sx?: any;
}
declare const HighlightedTimeInput: React.FC<HighlightedTimeInputProps>;
export default HighlightedTimeInput;
