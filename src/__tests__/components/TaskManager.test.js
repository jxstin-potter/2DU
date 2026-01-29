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
import { render, screen, fireEvent, waitFor } from './test-utils';
import { getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import TaskManager from '../../components/task-management/TaskManager';
import { mockTasks } from './test-utils';
// Mock the Firebase functions
var mockGetDocs = getDocs;
var mockAddDoc = addDoc;
var mockUpdateDoc = updateDoc;
var mockDeleteDoc = deleteDoc;
describe('TaskManager', function () {
    beforeEach(function () {
        // Reset all mocks before each test
        jest.clearAllMocks();
        // Setup default mock implementations
        mockGetDocs.mockImplementation(function () { return ({
            docs: mockTasks.map(function (task) { return ({
                id: task.id,
                data: function () { return (__assign({}, task)); },
            }); }),
        }); });
    });
    it('renders loading state initially', function () {
        render(_jsx(TaskManager, {}));
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    it('renders tasks after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskManager, {}));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
                            expect(screen.getByText('Test Task 2')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles task completion toggle', function () { return __awaiter(void 0, void 0, void 0, function () {
        var toggleButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskManager, {}));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    // Mock the updateDoc function to simulate successful update
                    mockUpdateDoc.mockResolvedValueOnce(undefined);
                    toggleButton = screen.getAllByRole('checkbox')[0];
                    fireEvent.click(toggleButton);
                    // Verify that updateDoc was called
                    return [4 /*yield*/, waitFor(function () {
                            expect(mockUpdateDoc).toHaveBeenCalled();
                        })];
                case 2:
                    // Verify that updateDoc was called
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles task deletion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var deleteButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskManager, {}));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    // Mock the deleteDoc function to simulate successful deletion
                    mockDeleteDoc.mockResolvedValueOnce(undefined);
                    deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
                    fireEvent.click(deleteButton);
                    // Verify that deleteDoc was called
                    return [4 /*yield*/, waitFor(function () {
                            expect(mockDeleteDoc).toHaveBeenCalled();
                        })];
                case 2:
                    // Verify that deleteDoc was called
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles error state', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Mock getDocs to throw an error
                    mockGetDocs.mockRejectedValueOnce(new Error('Failed to load data'));
                    render(_jsx(TaskManager, {}));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Failed to load data')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('switches between list and calendar views', function () { return __awaiter(void 0, void 0, void 0, function () {
        var calendarTab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskManager, {}));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    calendarTab = screen.getByRole('tab', { name: /calendar view/i });
                    fireEvent.click(calendarTab);
                    // Verify that the view has changed
                    expect(calendarTab).toHaveAttribute('aria-selected', 'true');
                    return [2 /*return*/];
            }
        });
    }); });
});
