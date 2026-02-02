var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState, useCallback } from 'react';
import { Box, InputLabel, FormHelperText } from '@mui/material';
import { useTheme, alpha } from '@mui/material';
var HighlightedTimeInput = function (_a) {
    var value = _a.value, onChange = _a.onChange, onTimeParsed = _a.onTimeParsed, label = _a.label, error = _a.error, helperText = _a.helperText, required = _a.required, disabled = _a.disabled, autoFocus = _a.autoFocus, externalRef = _a.inputRef, sx = _a.sx;
    var theme = useTheme();
    var internalRef = useRef(null);
    var inputRef = externalRef || internalRef;
    var _b = useState(null), matchInfo = _b[0], setMatchInfo = _b[1];
    var _c = useState(false), isFocused = _c[0], setIsFocused = _c[1];
    var isUpdatingRef = useRef(false);
    // Import parseTimeFromText dynamically to avoid circular dependencies
    var parseTime = useCallback(function (text) { return __awaiter(void 0, void 0, void 0, function () {
        var parseTimeFromText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, import('../../utils/taskHelpers')];
                case 1:
                    parseTimeFromText = (_a.sent()).parseTimeFromText;
                    return [2 /*return*/, parseTimeFromText(text)];
            }
        });
    }); }, []);
    // Initialize content on mount
    useEffect(function () {
        if (inputRef.current && !inputRef.current.textContent && value) {
            inputRef.current.textContent = value;
        }
    }, []); // Only run on mount
    // Parse time and update content when value changes
    useEffect(function () {
        // Always parse time, even if we skip DOM updates
        var parseAndNotify = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, time, parsedMatchInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/, parseTime(value)];
                    case 1:
                        _a = _b.sent(), time = _a.time, parsedMatchInfo = _a.matchInfo;
                        setMatchInfo(parsedMatchInfo || null);
                        onTimeParsed === null || onTimeParsed === void 0 ? void 0 : onTimeParsed(time, parsedMatchInfo || null);
                        return [2 /*return*/];
                }
            });
        }); };
        parseAndNotify();
        // Update DOM only if needed and not currently updating
        if (!inputRef.current || isUpdatingRef.current) {
            return;
        }
        var updateContent = function () { return __awaiter(void 0, void 0, void 0, function () {
            var parsedMatchInfo, currentText, selection, savedRange, preCaretRange, caretOffset, before, match, after, walker, currentOffset, targetNode, targetOffset, targetCaretOffset, node, nodeLength, newRange;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        return [4 /*yield*/, parseTime(value)];
                    case 1:
                        parsedMatchInfo = (_d.sent()).matchInfo;
                        if (!inputRef.current)
                            return [2 /*return*/];
                        currentText = inputRef.current.textContent || '';
                        if (currentText === value && !parsedMatchInfo) {
                            return [2 /*return*/];
                        }
                        selection = window.getSelection();
                        savedRange = null;
                        if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
                            savedRange = selection.getRangeAt(0).cloneRange();
                            preCaretRange = savedRange.cloneRange();
                            preCaretRange.selectNodeContents(inputRef.current);
                            preCaretRange.setEnd(savedRange.startContainer, savedRange.startOffset);
                            caretOffset = preCaretRange.toString().length;
                            savedRange = __assign(__assign({}, savedRange), { caretOffset: caretOffset });
                        }
                        // Create highlighted content
                        if (parsedMatchInfo && parsedMatchInfo.start >= 0 && parsedMatchInfo.end <= value.length) {
                            before = value.substring(0, parsedMatchInfo.start);
                            match = value.substring(parsedMatchInfo.start, parsedMatchInfo.end);
                            after = value.substring(parsedMatchInfo.end);
                            // Build HTML with highlighted span
                            isUpdatingRef.current = true;
                            inputRef.current.innerHTML = [
                                escapeHtml(before),
                                "<span data-testid=\"natural-language-match\" style=\"background-color: ".concat(alpha(theme.palette.primary.main, 0.2), "; border-radius: 2px; padding: 0 2px;\">").concat(escapeHtml(match), "</span>"),
                                escapeHtml(after),
                            ].join('');
                            // Restore cursor position
                            if (savedRange && savedRange.caretOffset !== undefined) {
                                try {
                                    walker = document.createTreeWalker(inputRef.current, NodeFilter.SHOW_TEXT, null);
                                    currentOffset = 0;
                                    targetNode = null;
                                    targetOffset = 0;
                                    targetCaretOffset = savedRange.caretOffset;
                                    while (walker.nextNode()) {
                                        node = walker.currentNode;
                                        nodeLength = ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.length) || 0;
                                        if (currentOffset + nodeLength >= targetCaretOffset) {
                                            targetNode = node;
                                            targetOffset = targetCaretOffset - currentOffset;
                                            break;
                                        }
                                        currentOffset += nodeLength;
                                    }
                                    if (targetNode) {
                                        newRange = document.createRange();
                                        newRange.setStart(targetNode, Math.min(targetOffset, ((_b = targetNode.textContent) === null || _b === void 0 ? void 0 : _b.length) || 0));
                                        newRange.setEnd(targetNode, Math.min(targetOffset, ((_c = targetNode.textContent) === null || _c === void 0 ? void 0 : _c.length) || 0));
                                        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
                                        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
                                    }
                                }
                                catch (e) {
                                    // Cursor restoration failed, continue
                                }
                            }
                            isUpdatingRef.current = false;
                        }
                        else {
                            // No match, just set plain text
                            isUpdatingRef.current = true;
                            inputRef.current.textContent = value;
                            isUpdatingRef.current = false;
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        updateContent();
    }, [value, parseTime, onTimeParsed, theme.palette.primary.main, inputRef]);
    var handleInput = useCallback(function (e) {
        if (isUpdatingRef.current) {
            return;
        }
        var text = e.currentTarget.textContent || '';
        onChange(text);
    }, [onChange]);
    var handleKeyDown = useCallback(function (e) {
        var _a;
        // Prevent Enter from creating a new line - let the form handle submission
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Find the closest form and submit it
            var form = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.closest('form');
            if (form) {
                var submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
            }
        }
    }, [inputRef]);
    var handlePaste = useCallback(function (e) {
        var _a;
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain');
        var selection = window.getSelection();
        if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
            var textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        var newValue = ((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.textContent) || '';
        onChange(newValue);
    }, [onChange, inputRef]);
    var escapeHtml = function (text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    return (_jsxs(Box, { sx: __assign({ flex: 1, display: 'flex', flexDirection: 'column' }, sx), children: [_jsxs(Box, { sx: { position: 'relative', display: 'flex', flexDirection: 'column' }, children: [label && (_jsxs(InputLabel, { shrink: isFocused || !!value, sx: {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            transform: isFocused || value ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 14px) scale(1)',
                            transformOrigin: 'top left',
                            color: error ? theme.palette.error.main : (isFocused ? theme.palette.primary.main : theme.palette.text.secondary),
                            pointerEvents: 'none',
                            transition: 'all 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms',
                            zIndex: 1,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.background.paper
                                : theme.palette.background.paper,
                            padding: isFocused || value ? '0 4px' : '0',
                        }, children: [label, required && ' *'] })), _jsx(Box, { ref: inputRef, contentEditable: !disabled, onInput: handleInput, onPaste: handlePaste, onKeyDown: handleKeyDown, onFocus: function () { return setIsFocused(true); }, onBlur: function () { return setIsFocused(false); }, suppressContentEditableWarning: true, sx: {
                            minHeight: '40px',
                            padding: label ? (isFocused || value ? '14px 14px 2px 14px' : '20px 14px 2px 14px') : '8.5px 14px',
                            border: "1px solid ".concat(error ? theme.palette.error.main : (isFocused ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.common.black, 0.2)))),
                            borderRadius: '4px',
                            backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.common.white, 0.05)
                                : alpha(theme.palette.common.black, 0.02),
                            color: theme.palette.text.primary,
                            fontSize: '0.875rem',
                            fontFamily: theme.typography.fontFamily,
                            outline: 'none',
                            cursor: disabled ? 'not-allowed' : 'text',
                            opacity: disabled ? 0.6 : 1,
                            transition: 'border-color 0.2s ease',
                            '&:hover': {
                                borderColor: error ? theme.palette.error.main : (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.common.black, 0.3)),
                            },
                            '&:focus': {
                                borderColor: theme.palette.primary.main,
                                borderWidth: '2px',
                                padding: label ? (isFocused || value ? '13px 13px 1px 13px' : '19px 13px 1px 13px') : '7.5px 13px',
                            },
                            '& span[data-testid="natural-language-match"]': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                borderRadius: '2px',
                                padding: '0 2px',
                            },
                        } })] }), helperText && (_jsx(FormHelperText, { error: error, sx: { mt: 0.5, mx: 1.75 }, children: helperText }))] }));
};
export default HighlightedTimeInput;
