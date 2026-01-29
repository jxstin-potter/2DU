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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Tabs, Tab, CircularProgress, styled, } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
// Styled TextField component with enhanced autofill fixes
var StyledTextField = styled(TextField)(function (_a) {
    var theme = _a.theme;
    return ({
        marginBottom: '16px',
        '& .MuiInputBase-root': {
            position: 'relative',
            minHeight: '56px', // Ensure consistent height
        },
        '& .MuiInputBase-input': {
            padding: '16px 14px', // Consistent padding
            '&:-webkit-autofill': {
                // Better autofill styling
                WebkitBoxShadow: theme.palette.mode === 'dark'
                    ? '0 0 0 100px #333 inset'
                    : '0 0 0 100px #f5f5f5 inset',
                WebkitTextFillColor: theme.palette.text.primary,
                caretColor: theme.palette.primary.main,
                borderRadius: 'inherit',
                // Longer transition to ensure it stays applied
                transition: 'background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s',
            },
        },
        '& .MuiInputLabel-root': {
            // Ensure label transitions properly with autofilled inputs
            '&.MuiFormLabel-filled': {
                transform: 'translate(14px, -9px) scale(0.75)',
            },
            // Fix animation for smoother transition
            transition: theme.transitions.create(['transform', 'color'], {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeOut,
            }),
        },
        // Special handling for autofilled state
        '& .MuiInputBase-input:-webkit-autofill + .MuiInputLabel-root': {
            transform: 'translate(14px, -9px) scale(0.75)',
            color: theme.palette.primary.main,
        },
    });
});
var AuthForm = function () {
    var _a = useAuth(), login = _a.login, signup = _a.signup;
    var navigate = useNavigate();
    var _b = useState(true), isLogin = _b[0], setIsLogin = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState({
        email: '',
        password: '',
        name: '',
    }), formData = _e[0], setFormData = _e[1];
    // Force update on mounted to handle autofill
    useEffect(function () {
        // Force a re-render after a short delay to handle autofill
        var timer = setTimeout(function () {
            // This forces the component to recognize autofilled fields
            var inputs = document.querySelectorAll('input');
            inputs.forEach(function (input) {
                var value = input.value;
                // Trigger change event if the input has a value
                if (value) {
                    var event_1 = new Event('input', { bubbles: true });
                    input.dispatchEvent(event_1);
                    // Update our state if the input has a name that matches our form fields
                    if (input.name && input.name in formData) {
                        setFormData(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = value, _a)));
                        });
                    }
                }
            });
        }, 100);
        return function () { return clearTimeout(timer); };
    }, []);
    var validateForm = function () {
        if (!formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }
        if (!isLogin && !formData.name) {
            setError('Please enter your name');
            return false;
        }
        // Basic email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        // Password validation (at least 6 characters)
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!isLogin) return [3 /*break*/, 3];
                    return [4 /*yield*/, login(formData.email, formData.password)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, signup(formData.email, formData.password, formData.name)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    navigate('/');
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'An error occurred');
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[e.target.name] = e.target.value, _a)));
        });
        setError(null); // Clear error when user types
    };
    return (_jsx(Box, { sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
        }, children: _jsxs(Paper, { elevation: 3, sx: {
                p: 4,
                width: '100%',
                maxWidth: 400,
            }, children: [_jsx(Typography, { variant: "h4", align: "center", gutterBottom: true, sx: {
                        background: 'linear-gradient(45deg, #4a90e2 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                    }, children: "2DU" }), _jsx(Typography, { variant: "subtitle1", align: "center", color: "text.secondary", gutterBottom: true, children: isLogin ? 'Welcome back!' : 'Create your account' }), _jsxs(Tabs, { value: isLogin ? 0 : 1, onChange: function (_, newValue) { return setIsLogin(newValue === 0); }, sx: { mb: 3 }, children: [_jsx(Tab, { label: "Login" }), _jsx(Tab, { label: "Sign Up" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [!isLogin && (_jsx(StyledTextField, { fullWidth: true, label: "Name", name: "name", value: formData.name, onChange: handleChange, required: true, disabled: isLoading, variant: "outlined" })), _jsx(StyledTextField, { fullWidth: true, label: "Email", name: "email", type: "email", value: formData.email, onChange: handleChange, required: true, disabled: isLoading, variant: "outlined" }), _jsx(StyledTextField, { fullWidth: true, label: "Password", name: "password", type: "password", value: formData.password, onChange: handleChange, required: true, disabled: isLoading, variant: "outlined" }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", sx: { mt: 3 }, disabled: isLoading, children: isLoading ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : (isLogin ? 'Sign In' : 'Sign Up') })] })] }) }));
};
export default AuthForm;
