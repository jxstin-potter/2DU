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
import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthContext } from '../../contexts/AuthContext';
// Mock the Firebase auth functions
vi.mock('../../firebase', function () { return ({
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
}); });
describe('Authentication Component', function () {
    var mockSetUser = vi.fn();
    var mockSetLoading = vi.fn();
    var mockSetError = vi.fn();
    beforeEach(function () {
        vi.clearAllMocks();
    });
    it('renders the login form correctly', function () {
        render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });
    it('switches between login and signup forms', function () {
        render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
        // Initially shows login form
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        // Click create account button
        fireEvent.click(screen.getByText('Create Account'));
        // Now shows signup form
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        // Click login button
        fireEvent.click(screen.getByText('Back to Login'));
        // Back to login form
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
    it('handles login with valid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
        var signInWithEmailAndPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signInWithEmailAndPassword = require('../../firebase').signInWithEmailAndPassword;
                    signInWithEmailAndPassword.mockResolvedValueOnce({
                        user: {
                            uid: 'test-user-id',
                            email: 'test@example.com',
                        },
                    });
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
                    fireEvent.click(screen.getByText('Sign In'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
                            expect(mockSetUser).toHaveBeenCalledWith({
                                uid: 'test-user-id',
                                email: 'test@example.com',
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles signup with valid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
        var createUserWithEmailAndPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createUserWithEmailAndPassword = require('../../firebase').createUserWithEmailAndPassword;
                    createUserWithEmailAndPassword.mockResolvedValueOnce({
                        user: {
                            uid: 'test-user-id',
                            email: 'test@example.com',
                        },
                    });
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    // Switch to signup form
                    fireEvent.click(screen.getByText('Create Account'));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
                    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
                    fireEvent.click(screen.getByText('Sign Up'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
                            expect(mockSetUser).toHaveBeenCalledWith({
                                uid: 'test-user-id',
                                email: 'test@example.com',
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('validates password match during signup', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    // Switch to signup form
                    fireEvent.click(screen.getByText('Create Account'));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
                    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });
                    fireEvent.click(screen.getByText('Sign Up'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles password reset', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendPasswordResetEmail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendPasswordResetEmail = require('../../firebase').sendPasswordResetEmail;
                    sendPasswordResetEmail.mockResolvedValueOnce();
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    fireEvent.click(screen.getByText('Forgot Password?'));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.click(screen.getByText('Reset Password'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
                            expect(screen.getByText('Password reset email sent')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles login errors', function () { return __awaiter(void 0, void 0, void 0, function () {
        var signInWithEmailAndPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signInWithEmailAndPassword = require('../../firebase').signInWithEmailAndPassword;
                    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
                    fireEvent.click(screen.getByText('Sign In'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles signup errors', function () { return __awaiter(void 0, void 0, void 0, function () {
        var createUserWithEmailAndPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createUserWithEmailAndPassword = require('../../firebase').createUserWithEmailAndPassword;
                    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Email already in use'));
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    // Switch to signup form
                    fireEvent.click(screen.getByText('Create Account'));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
                    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
                    fireEvent.click(screen.getByText('Sign Up'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Email already in use')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('shows loading state during authentication', function () { return __awaiter(void 0, void 0, void 0, function () {
        var signInWithEmailAndPassword;
        return __generator(this, function (_a) {
            signInWithEmailAndPassword = require('../../firebase').signInWithEmailAndPassword;
            signInWithEmailAndPassword.mockImplementation(function () { return new Promise(function (resolve) { return setTimeout(resolve, 100); }); });
            render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
            fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
            fireEvent.click(screen.getByText('Sign In'));
            expect(screen.getByText('Sign In')).toBeDisabled();
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            return [2 /*return*/];
        });
    }); });
    it('validates email format', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
                    fireEvent.click(screen.getByText('Sign In'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('validates password strength', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(AuthContext.Provider, { value: { user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }, children: _jsx(Authentication, {}) }));
                    // Switch to signup form
                    fireEvent.click(screen.getByText('Create Account'));
                    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
                    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weak' } });
                    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'weak' } });
                    fireEvent.click(screen.getByText('Sign Up'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
