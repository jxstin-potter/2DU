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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
export var useCategories = function () {
    var _a = useState([]), categories = _a[0], setCategories = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    useEffect(function () {
        loadCategories();
    }, []);
    var loadCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var categoriesCollection, categoriesQuery, snapshot, loadedCategories, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    categoriesCollection = collection(db, 'categories');
                    categoriesQuery = query(categoriesCollection, orderBy('order'));
                    return [4 /*yield*/, getDocs(categoriesQuery)];
                case 1:
                    snapshot = _a.sent();
                    loadedCategories = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    setCategories(loadedCategories);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError('Failed to load categories');
                    console.error('Error loading categories:', err_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var addCategory = function (category) { return __awaiter(void 0, void 0, void 0, function () {
        var categoriesCollection, docRef, newCategory_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    categoriesCollection = collection(db, 'categories');
                    return [4 /*yield*/, addDoc(categoriesCollection, __assign(__assign({}, category), { order: categories.length }))];
                case 1:
                    docRef = _a.sent();
                    newCategory_1 = __assign(__assign({}, category), { id: docRef.id });
                    setCategories(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newCategory_1], false); });
                    return [2 /*return*/, newCategory_1];
                case 2:
                    err_2 = _a.sent();
                    setError('Failed to add category');
                    console.error('Error adding category:', err_2);
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var updateCategory = function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var categoryRef, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    categoryRef = doc(db, 'categories', id);
                    return [4 /*yield*/, updateDoc(categoryRef, updates)];
                case 1:
                    _a.sent();
                    setCategories(function (prev) {
                        return prev.map(function (cat) { return cat.id === id ? __assign(__assign({}, cat), updates) : cat; });
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    setError('Failed to update category');
                    console.error('Error updating category:', err_3);
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var deleteCategory = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var categoryRef, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    categoryRef = doc(db, 'categories', id);
                    return [4 /*yield*/, deleteDoc(categoryRef)];
                case 1:
                    _a.sent();
                    setCategories(function (prev) { return prev.filter(function (cat) { return cat.id !== id; }); });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    setError('Failed to delete category');
                    console.error('Error deleting category:', err_4);
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return {
        categories: categories,
        loading: loading,
        error: error,
        addCategory: addCategory,
        updateCategory: updateCategory,
        deleteCategory: deleteCategory,
        refreshCategories: loadCategories
    };
};
