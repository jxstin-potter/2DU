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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog, DialogContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Stack, Alert, CircularProgress, useTheme, alpha, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import HighlightedTimeInput from '../ui/HighlightedTimeInput';
var TaskModal = function (_a) {
    var open = _a.open, onClose = _a.onClose, onSubmit = _a.onSubmit, initialTask = _a.initialTask, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var theme = useTheme();
    var _c = useState(''), title = _c[0], setTitle = _c[1];
    var _d = useState(''), description = _d[0], setDescription = _d[1];
    var _e = useState(null), dueDate = _e[0], setDueDate = _e[1];
    var _f = useState(''), priority = _f[0], setPriority = _f[1];
    var _g = useState({}), errors = _g[0], setErrors = _g[1];
    var _h = useState(false), isSubmitting = _h[0], setIsSubmitting = _h[1];
    var _j = useState(null), timeMatchInfo = _j[0], setTimeMatchInfo = _j[1];
    var titleInputRef = useRef(null);
    useEffect(function () {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description || '');
            setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
            setPriority(initialTask.priority || '');
        }
        else {
            resetForm();
            setDueDate(new Date());
        }
    }, [initialTask, open]);
    // Auto-focus the title input when modal opens (backup mechanism)
    useEffect(function () {
        if (open && titleInputRef.current) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(function () {
                setTimeout(function () {
                    var _a;
                    (_a = titleInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                }, 0);
            });
        }
    }, [open]);
    // Warn on reload/close when modal is open and form has unsaved changes
    var isDirty = useMemo(function () {
        if (!open)
            return false;
        if (initialTask) {
            var descMatch = (initialTask.description || '') === description;
            var dateMatch = (initialTask.dueDate == null && dueDate == null) ||
                (initialTask.dueDate != null && dueDate != null && new Date(initialTask.dueDate).getTime() === dueDate.getTime());
            return title !== initialTask.title || !descMatch || !dateMatch || (initialTask.priority || '') !== priority;
        }
        return title.trim() !== '' || description.trim() !== '' || priority !== '';
    }, [open, initialTask, title, description, dueDate, priority]);
    useEffect(function () {
        var handleBeforeUnload = function (e) {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return function () { return window.removeEventListener('beforeunload', handleBeforeUnload); };
    }, [isDirty]);
    var resetForm = function () {
        setTitle('');
        setDescription('');
        setDueDate(null);
        setPriority('');
        setErrors({});
        setIsSubmitting(false);
    };
    var validateForm = function () {
        var newErrors = {};
        if (!title.trim()) {
            newErrors.title = 'Task name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var currentTitle, finalTitle, taskData, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    currentTitle = ((_a = titleInputRef.current) === null || _a === void 0 ? void 0 : _a.textContent) || title;
                    // Update title state if it differs from contentEditable
                    if (currentTitle !== title) {
                        setTitle(currentTitle);
                    }
                    // Wait a tick for state to update, then validate
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1:
                    // Wait a tick for state to update, then validate
                    _c.sent();
                    if (!validateForm() || isSubmitting) {
                        return [2 /*return*/];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, 5, 6]);
                    setIsSubmitting(true);
                    finalTitle = ((_b = titleInputRef.current) === null || _b === void 0 ? void 0 : _b.textContent) || title;
                    taskData = {
                        title: finalTitle.trim(),
                        description: description || undefined,
                        dueDate: dueDate || undefined,
                        priority: priority ? priority : undefined,
                        status: 'todo',
                        createdAt: (initialTask === null || initialTask === void 0 ? void 0 : initialTask.createdAt) || new Date(),
                        updatedAt: new Date(),
                    };
                    return [4 /*yield*/, onSubmit(taskData)];
                case 3:
                    // #endregion
                    _c.sent();
                    resetForm();
                    onClose();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _c.sent();
                    setErrors({
                        submit: 'Failed to save task. Please try again.'
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleClose = function () {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };
    return (_jsx(Dialog, { open: open, onClose: handleClose, PaperProps: {
            sx: {
                width: '550px',
                height: '190px',
                maxWidth: '550px',
                maxHeight: '190px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                m: 0,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 60px -12px rgba(0, 0, 0, 0.5), 0 8px 24px -4px rgba(0, 0, 0, 0.4)'
                    : '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 24px -4px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
            }
        }, TransitionProps: {
            onEntered: function () {
                var _a;
                (_a = titleInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
        }, disableEscapeKeyDown: isSubmitting, children: _jsx(DialogContent, { sx: {
                p: 2,
                height: '100%',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                '&.MuiDialogContent-root': {
                    paddingTop: 2,
                }
            }, children: _jsx("form", { onSubmit: handleSubmit, style: { height: '100%', display: 'flex', flexDirection: 'column' }, children: _jsxs(Stack, { spacing: 1.5, sx: { flexGrow: 1 }, children: [errors.submit && (_jsx(Alert, { severity: "error", sx: {
                                py: 0.5,
                                backgroundColor: alpha(theme.palette.error.main, 0.15),
                                color: theme.palette.text.primary,
                                '& .MuiAlert-icon': {
                                    color: theme.palette.error.main,
                                },
                            }, children: errors.submit })), _jsxs(Box, { sx: { display: 'flex', gap: 1.5 }, children: [_jsx(HighlightedTimeInput, { inputRef: titleInputRef, autoFocus: true, label: "Task name", value: title, onChange: function (inputValue) {
                                        setTitle(inputValue);
                                    }, onTimeParsed: function (time, matchInfo) {
                                        setTimeMatchInfo(matchInfo);
                                        if (time) {
                                            setDueDate(time);
                                        }
                                        else {
                                            setDueDate(null);
                                        }
                                    }, error: !!errors.title, helperText: errors.title, required: true, disabled: isSubmitting, sx: { flex: 1 } }), _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "Date", value: dueDate, onChange: function (newValue) { return setDueDate(newValue); }, slotProps: {
                                            textField: {
                                                size: 'small',
                                                sx: {
                                                    width: '140px',
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: theme.palette.mode === 'dark'
                                                            ? alpha(theme.palette.common.white, 0.05)
                                                            : alpha(theme.palette.common.black, 0.02),
                                                        '& fieldset': {
                                                            borderColor: theme.palette.mode === 'dark'
                                                                ? alpha(theme.palette.common.white, 0.2)
                                                                : alpha(theme.palette.common.black, 0.2),
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: theme.palette.mode === 'dark'
                                                                ? alpha(theme.palette.common.white, 0.3)
                                                                : alpha(theme.palette.common.black, 0.3),
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: theme.palette.text.secondary,
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: theme.palette.primary.main,
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        color: theme.palette.text.primary,
                                                    },
                                                },
                                            },
                                        }, disabled: isSubmitting }) }), _jsxs(FormControl, { size: "small", sx: { width: '120px' }, children: [_jsx(InputLabel, { sx: { color: theme.palette.text.secondary }, children: "Priority" }), _jsxs(Select, { value: priority, onChange: function (e) { return setPriority(e.target.value); }, label: "Priority", disabled: isSubmitting, sx: {
                                                color: theme.palette.text.primary,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.mode === 'dark'
                                                        ? alpha(theme.palette.common.white, 0.2)
                                                        : alpha(theme.palette.common.black, 0.2),
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.mode === 'dark'
                                                        ? alpha(theme.palette.common.white, 0.3)
                                                        : alpha(theme.palette.common.black, 0.3),
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: theme.palette.text.secondary,
                                                },
                                            }, MenuProps: {
                                                PaperProps: {
                                                    sx: {
                                                        backgroundColor: theme.palette.background.paper,
                                                        '& .MuiMenuItem-root': {
                                                            color: theme.palette.text.primary,
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.action.hover,
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }, children: [_jsx(MenuItem, { value: "", children: "None" }), _jsx(MenuItem, { value: "low", children: "Low" }), _jsx(MenuItem, { value: "medium", children: "Medium" }), _jsx(MenuItem, { value: "high", children: "High" })] })] })] }), _jsx(TextField, { label: "Description", value: description, onChange: function (e) { return setDescription(e.target.value); }, multiline: true, rows: 1, size: "small", fullWidth: true, disabled: isSubmitting, sx: {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.05)
                                        : alpha(theme.palette.common.black, 0.02),
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark'
                                            ? alpha(theme.palette.common.white, 0.2)
                                            : alpha(theme.palette.common.black, 0.2),
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.mode === 'dark'
                                            ? alpha(theme.palette.common.white, 0.3)
                                            : alpha(theme.palette.common.black, 0.3),
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: theme.palette.text.secondary,
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: theme.palette.primary.main,
                                },
                                '& .MuiInputBase-input': {
                                    color: theme.palette.text.primary,
                                },
                            } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }, children: [_jsx(Button, { onClick: handleClose, disabled: isSubmitting, size: "small", sx: {
                                        color: theme.palette.text.secondary,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: isSubmitting || loading, size: "small", sx: {
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                        },
                                        '&:disabled': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.3),
                                            color: alpha(theme.palette.primary.contrastText, 0.5),
                                        },
                                    }, children: isSubmitting ? (_jsx(CircularProgress, { size: 20, color: "inherit" })) : ('Add Task') })] })] }) }) }) }));
};
export default TaskModal;
