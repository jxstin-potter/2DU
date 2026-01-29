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
import TaskModal from '../../components/modals/TaskModal';
describe('TaskModal Component', function () {
    var mockTask = {
        id: '1',
        title: 'Test Task',
        completed: false,
        dueDate: new Date('2023-12-31'),
        order: 0,
        tags: ['Work'],
        userId: 'test-user-id',
    };
    var mockOnSave = vi.fn();
    var mockOnClose = vi.fn();
    beforeEach(function () {
        vi.clearAllMocks();
    });
    it('renders the create task modal correctly', function () {
        render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
        expect(screen.getByText('Create New Task')).toBeInTheDocument();
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
        expect(screen.getByLabelText('Tags')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
    it('renders the edit task modal correctly', function () {
        render(_jsx(TaskModal, { open: true, task: mockTask, onClose: mockOnClose, onSave: mockOnSave }));
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2023-12-31')).toBeInTheDocument();
        expect(screen.getByText('Work')).toBeInTheDocument();
    });
    it('calls onClose when cancel button is clicked', function () {
        render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
        fireEvent.click(screen.getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    it('calls onClose when clicking outside the modal', function () {
        render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
        fireEvent.click(screen.getByTestId('modal-backdrop'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    it('validates required fields when creating a task', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
                    fireEvent.click(screen.getByText('Save'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Title is required')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    expect(mockOnSave).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('validates date format when creating a task', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
                    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
                    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: 'invalid-date' } });
                    fireEvent.click(screen.getByText('Save'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Invalid date format')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    expect(mockOnSave).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('calls onSave with correct data when creating a task', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
                    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
                    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
                    fireEvent.change(screen.getByLabelText('Tags'), { target: { value: 'Work,Personal' } });
                    fireEvent.click(screen.getByText('Save'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(mockOnSave).toHaveBeenCalledWith({
                                title: 'New Task',
                                completed: false,
                                dueDate: expect.any(Date),
                                order: 0,
                                tags: ['Work', 'Personal'],
                                userId: 'test-user-id',
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('calls onSave with correct data when editing a task', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(_jsx(TaskModal, { open: true, task: mockTask, onClose: mockOnClose, onSave: mockOnSave }));
                    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Task' } });
                    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-30' } });
                    fireEvent.change(screen.getByLabelText('Tags'), { target: { value: 'Work,Personal,Urgent' } });
                    fireEvent.click(screen.getByText('Save'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(mockOnSave).toHaveBeenCalledWith({
                                id: '1',
                                title: 'Updated Task',
                                completed: false,
                                dueDate: expect.any(Date),
                                order: 0,
                                tags: ['Work', 'Personal', 'Urgent'],
                                userId: 'test-user-id',
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles tag input correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tagInput;
        return __generator(this, function (_a) {
            render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
            tagInput = screen.getByLabelText('Tags');
            fireEvent.change(tagInput, { target: { value: 'Work' } });
            fireEvent.keyDown(tagInput, { key: 'Enter' });
            fireEvent.change(tagInput, { target: { value: 'Personal' } });
            fireEvent.keyDown(tagInput, { key: 'Enter' });
            expect(screen.getByText('Work')).toBeInTheDocument();
            expect(screen.getByText('Personal')).toBeInTheDocument();
            return [2 /*return*/];
        });
    }); });
    it('removes tags when clicking the remove button', function () { return __awaiter(void 0, void 0, void 0, function () {
        var removeButton;
        return __generator(this, function (_a) {
            render(_jsx(TaskModal, { open: true, task: mockTask, onClose: mockOnClose, onSave: mockOnSave }));
            removeButton = screen.getByTestId('remove-tag-Work');
            fireEvent.click(removeButton);
            expect(screen.queryByText('Work')).not.toBeInTheDocument();
            return [2 /*return*/];
        });
    }); });
    it('disables the save button while saving', function () { return __awaiter(void 0, void 0, void 0, function () {
        var saveButton;
        return __generator(this, function (_a) {
            render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
            fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
            fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
            fireEvent.click(screen.getByText('Save'));
            saveButton = screen.getByText('Save');
            expect(saveButton).toBeDisabled();
            return [2 /*return*/];
        });
    }); });
    it('shows error message when save fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockOnSave.mockRejectedValueOnce(new Error('Failed to save task'));
                    render(_jsx(TaskModal, { open: true, onClose: mockOnClose, onSave: mockOnSave }));
                    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
                    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
                    fireEvent.click(screen.getByText('Save'));
                    return [4 /*yield*/, waitFor(function () {
                            expect(screen.getByText('Failed to save task')).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
