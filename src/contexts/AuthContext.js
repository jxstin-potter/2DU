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
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, enablePersistence } from '../firebase';
// Create the context with a default value
var AuthContext = createContext({
    user: null,
    loading: true,
    login: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    signup: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    logout: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    updateUserProfile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
});
// Custom hook to use the auth context
export var useAuth = function () { return useContext(AuthContext); };
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), user = _b[0], setUser = _b[1];
    var _c = useState(null), firebaseUser = _c[0], setFirebaseUser = _c[1];
    var _d = useState(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState(false), isAuthReady = _e[0], setIsAuthReady = _e[1];
    // Handle fetching user data from Firestore
    var fetchUserData = function (firebaseUser) { return __awaiter(void 0, void 0, void 0, function () {
        var userDocRef, userDoc, userData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userDocRef = doc(db, 'users', firebaseUser.uid);
                    return [4 /*yield*/, getDoc(userDocRef)];
                case 1:
                    userDoc = _a.sent();
                    if (userDoc.exists()) {
                        userData = userDoc.data();
                        return [2 /*return*/, __assign({ id: firebaseUser.uid }, userData)];
                    }
                    else {
                        // User authenticated but no document in Firestore yet
                        return [2 /*return*/, {
                                id: firebaseUser.uid,
                                email: firebaseUser.email || '',
                                name: firebaseUser.displayName || '',
                                preferences: {
                                    theme: 'light',
                                    highContrast: false,
                                    notifications: true,
                                    defaultView: 'today'
                                }
                            }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching user data:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Listen for auth state changes
    useEffect(function () {
        var authUnsubscribe;
        var setupAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
            var persistError_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, enablePersistence()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        persistError_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        // Now listen for auth state changes
                        authUnsubscribe = onAuthStateChanged(auth, function (authUser) { return __awaiter(void 0, void 0, void 0, function () {
                            var userData, fetchError_1, fallbackUser, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        setIsLoading(true);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 9, 10, 11]);
                                        if (!authUser) return [3 /*break*/, 7];
                                        setFirebaseUser(authUser);
                                        // Wait before trying Firestore operations
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 2:
                                        // Wait before trying Firestore operations
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, fetchUserData(authUser)];
                                    case 4:
                                        userData = _a.sent();
                                        setUser(userData);
                                        return [3 /*break*/, 6];
                                    case 5:
                                        fetchError_1 = _a.sent();
                                        fallbackUser = {
                                            id: authUser.uid,
                                            email: authUser.email || '',
                                            name: authUser.displayName || '',
                                            preferences: {
                                                theme: 'light',
                                                highContrast: false,
                                                notifications: true,
                                                defaultView: 'today'
                                            }
                                        };
                                        setUser(fallbackUser);
                                        return [3 /*break*/, 6];
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        // User is signed out
                                        setFirebaseUser(null);
                                        setUser(null);
                                        _a.label = 8;
                                    case 8: return [3 /*break*/, 11];
                                    case 9:
                                        error_3 = _a.sent();
                                        // Only clear user if we don't have a valid authUser
                                        if (!authUser) {
                                            setFirebaseUser(null);
                                            setUser(null);
                                        }
                                        return [3 /*break*/, 11];
                                    case 10:
                                        setIsLoading(false);
                                        setIsAuthReady(true);
                                        return [7 /*endfinally*/];
                                    case 11: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        setIsAuthReady(true);
                        setIsLoading(false);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        setupAuth();
        // Cleanup subscription on unmount
        return function () {
            if (authUnsubscribe) {
                authUnsubscribe();
            }
        };
    }, []);
    var login = useCallback(function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    // Handle the authentication (simplified - no network manipulation)
                    return [4 /*yield*/, signInWithEmailAndPassword(auth, email, password)];
                case 1:
                    // Handle the authentication (simplified - no network manipulation)
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    error_4 = _a.sent();
                    throw new Error('Invalid email or password');
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var signup = useCallback(function (email, password, name) { return __awaiter(void 0, void 0, void 0, function () {
        var userCredential, authUser, userData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, createUserWithEmailAndPassword(auth, email, password)];
                case 1:
                    userCredential = _a.sent();
                    authUser = userCredential.user;
                    userData = {
                        email: email.toLowerCase(),
                        name: name.trim(),
                        preferences: {
                            theme: 'light',
                            highContrast: false,
                            notifications: true,
                            defaultView: 'today'
                        }
                    };
                    return [4 /*yield*/, setDoc(doc(db, 'users', authUser.uid), userData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    if (error_5 instanceof Error && error_5.message.includes('already in use')) {
                        throw new Error('Email already exists');
                    }
                    throw new Error('Failed to create account');
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var logout = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, signOut(auth)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    throw new Error('Failed to log out');
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    var updateUserProfile = useCallback(function (updates) { return __awaiter(void 0, void 0, void 0, function () {
        var userRef, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(firebaseUser === null || firebaseUser === void 0 ? void 0 : firebaseUser.uid))
                        return [2 /*return*/];
                    userRef = doc(db, 'users', firebaseUser.uid);
                    return [4 /*yield*/, setDoc(userRef, updates, { merge: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchUserData(firebaseUser)];
                case 2:
                    updated = _a.sent();
                    setUser(updated);
                    return [2 /*return*/];
            }
        });
    }); }, [firebaseUser]);
    var contextValue = useMemo(function () { return ({
        user: user,
        loading: isLoading,
        login: login,
        signup: signup,
        logout: logout,
        updateUserProfile: updateUserProfile,
    }); }, [user, isLoading, login, signup, logout, updateUserProfile]);
    if (!isAuthReady) {
        return _jsx("div", { children: "Initializing authentication..." });
    }
    return (_jsx(AuthContext.Provider, { value: contextValue, children: children }));
};
