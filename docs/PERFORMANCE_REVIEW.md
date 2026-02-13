# Performance Review: Re-renders & Computations

## Executive Summary

The codebase has several patterns that cause unnecessary re-renders and redundant computations. The most impactful are: **unstable callback/object props** breaking `TaskItem` memoization, **handleTaskToggle depending on `tasks`** (causing all TaskItems to re-render on any task change), and **inline object creation** for `onTaskAction`. Lower-priority issues include missing `React.memo` on list items and context value churn.

---

## Critical Issues

### 1. Unstable `onTaskAction` object (Inbox, Today, TaskManager)

**Location:** `Inbox.tsx`, `Today.tsx`, `TaskManager.tsx`

**Problem:** The `onTaskAction` object is created inline every render:
```tsx
onTaskAction={{
  toggle: handleTaskToggle,
  delete: handleTaskDelete,
  update: handleTaskUpdate,
  edit: (task: Task) => { setSelectedTask(task); openTaskModal(); },
}}
```
Every parent re-render creates a new object reference. `InboxView`/`TodayView` pass it to `TaskItem`, which is wrapped in `React.memo`. Because the object is new each render, memoization never skips re-renders.

**Impact:** All TaskItems re-render whenever Inbox/Today/TaskManager re-render (e.g. task list updates, snackbar state, modal state).

**Fix:** Memoize the object:
```tsx
const onTaskAction = useMemo(() => ({
  toggle: handleTaskToggle,
  delete: handleTaskDelete,
  update: handleTaskUpdate,
  edit: handleTaskEdit,
}), [handleTaskToggle, handleTaskDelete, handleTaskUpdate, handleTaskEdit]);
```

---

### 2. `handleTaskToggle` depends on `tasks` (Inbox, Today)

**Location:** `Inbox.tsx:75-96`, `Today.tsx:79-100`

**Problem:**
```tsx
const handleTaskToggle = useCallback(async (taskId: string) => {
  const task = tasks.find(t => t.id === taskId);
  // ...
}, [tasks, user?.id]);
```
`tasks` changes on every Firestore update. That makes `handleTaskToggle` a new function reference every time tasks change, which cascades to `onTaskAction` and all TaskItems.

**Impact:** Every task list update (e.g. from subscription) invalidates the toggle handler and causes full TaskItem list re-renders.

**Fix:** Avoid depending on `tasks`; use a ref or read from a callback:
```tsx
const tasksRef = useRef(tasks);
tasksRef.current = tasks;
const handleTaskToggle = useCallback(async (taskId: string) => {
  const task = tasksRef.current.find(t => t.id === taskId);
  // ...
}, [user?.id]);
```

---

### 3. `handleTaskDelete` and `handleTaskUpdate` not memoized (Inbox, Today)

**Location:** `Inbox.tsx:110-135`, `Today.tsx` (similar)

**Problem:** These handlers are plain async functions, not wrapped in `useCallback`. New function references every render.

**Fix:** Wrap in `useCallback` with stable deps:
```tsx
const handleTaskDelete = useCallback(async (taskId: string) => {
  // ...
}, [user?.id]);

const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<Task>) => {
  // ...
}, [user?.id]);
```

---

### 4. TaskList Row: inline callbacks break TaskItem memo

**Location:** `TaskList.tsx:138-196`

**Problem:** The `Row` renderer passes inline arrow functions to `TaskItem`:
```tsx
onToggleComplete={() => handleTaskAction('toggle', task.id)}
onDelete={() => handleTaskAction('delete', task.id)}
onEdit={() => handleTaskAction('edit', task)}
```
Each creates a new function reference per row per render. `TaskItem` is memoized, so these props always change and memo never helps.

**Impact:** Every `FixedSizeList` render re-renders all visible TaskItems.

**Fix:** Use a stable callback that accepts `(action, taskId)` or `(action, task)`:
```tsx
// In TaskList, pass a single handler:
onTaskAction={(action, ...args) => handleTaskAction(action, ...args)}

// Or create a row-level memo: each TaskItem gets a stable callback via useCallback
// that closes over task.id. Requires restructuring Row to a separate component.
```
Alternatively, extract a `TaskRow` component that receives `task` and `onTaskAction`, and memoizes per-task callbacks internally.

---

### 5. `handleTaskAction` depends on `onTaskAction` object (TaskList)

**Location:** `TaskList.tsx:89-105`

**Problem:**
```tsx
const handleTaskAction = useCallback(async (action, ...args) => {
  const actionFn = onTaskAction[action];
  // ...
}, [actionInProgress, onTaskAction]);
```
`onTaskAction` is the inline object from the parent. New reference every render → `handleTaskAction` changes → `Row` useCallback deps change → Row recreated → all items re-render.

**Fix:** Memoize `onTaskAction` at the page level (see #1). That stabilizes `handleTaskAction` when `actionInProgress` is stable.

---

## Medium Issues

### 6. TaskItem inline handlers for InlineTaskEditor (TaskItem.tsx)

**Location:** `TaskItem.tsx:256-269`

**Problem:**
```tsx
onSubmit={async (taskData) => {
  await onUpdate(task.id, taskData);
  setActiveInlineTaskId(null);
  setIsInlineEditing(false);
}}
onCancel={() => {
  setActiveInlineTaskId(null);
  setIsInlineEditing(false);
}}
```
New function refs every render. Only relevant when the inline editor is shown, so impact is limited to the active editing task.

**Fix:** Wrap in `useCallback`:
```tsx
const handleInlineSubmit = useCallback(async (taskData: Partial<Task>) => {
  await onUpdate(task.id, taskData);
  setActiveInlineTaskId(null);
  setIsInlineEditing(false);
}, [onUpdate, task.id, setActiveInlineTaskId]);
```

---

### 7. TaskModal `onSubmit` / `onClose` inline (Inbox, Today)

**Location:** `Inbox.tsx:204-218`, `Today.tsx` (similar)

**Problem:**
```tsx
onClose={() => { closeTaskModal(); setSelectedTask(null); }}
onSubmit={selectedTask ? async (taskData) => {...} : handleCreateTask}
```
New functions every render.

**Fix:** Memoize:
```tsx
const handleModalClose = useCallback(() => {
  closeTaskModal();
  setSelectedTask(null);
}, [closeTaskModal]);

const handleModalSubmit = useMemo(() =>
  selectedTask
    ? async (taskData: Partial<Task>) => {
        if (selectedTask.id) {
          await handleTaskUpdate(selectedTask.id, taskData);
          closeTaskModal();
          setSelectedTask(null);
        }
      }
    : handleCreateTask,
  [selectedTask, handleTaskUpdate, closeTaskModal, handleCreateTask]
);
```

---

### 8. CompletedTaskItem not memoized

**Location:** `CompletedTaskItem.tsx`

**Problem:** Rendered in lists (e.g. Completed page) but not wrapped in `React.memo`. Every parent re-render re-renders all completed task rows.

**Fix:** `export default React.memo(CompletedTaskItem);`

---

### 9. TaskMetadataContext: broad provider re-renders

**Location:** `TaskMetadataContext.tsx`, `ProtectedLayout.tsx`

**Problem:** `TaskMetadataProvider` wraps `MainLayout` and all page content. The context value includes `categories`, `tags`, and several functions. When `tags` or `categories` change (e.g. new tag, refresh), the entire value changes and all consumers re-render.

**Impact:** `TaskItem` uses `useTaskMetadata()` for tags/categories. Any metadata change re-renders every TaskItem.

**Mitigation:** Consider splitting context (e.g. `TagsContext`, `CategoriesContext`) so only consumers of the changed data re-render. Or use a selector pattern / smaller slices.

---

## Lower-Priority Issues

### 10. `handleTaskAction` in TaskList depends on `actionInProgress`

**Location:** `TaskList.tsx:89-105`

**Problem:** `actionInProgress` in deps means `handleTaskAction` changes whenever any action starts/finishes. That invalidates `Row` and causes list re-renders during operations.

**Fix:** Use a ref for `actionInProgress` when only used as a guard:
```tsx
const actionInProgressRef = useRef<string | null>(null);
actionInProgressRef.current = actionInProgress;
const handleTaskAction = useCallback(async (action, ...args) => {
  if (actionInProgressRef.current) return;
  // ...
}, [onTaskAction]);  // Remove actionInProgress from deps
```

---

### 11. InboxView `isActionInProgress={loading}`

**Location:** `InboxView.tsx:120`, `TaskItem` receives `isActionInProgress`

**Problem:** `loading` is true during initial fetch. Passing it as `isActionInProgress` disables all action buttons while loading. If `loading` flips frequently, it can cause churn. Verify this is intentional (disable during initial load vs. during a specific action).

---

### 12. TodayAddTaskButton `onClick={() => setShowInlineEditor(true)}`

**Location:** `InboxView.tsx:149`, `TodayView.tsx` (similar)

**Problem:** Inline arrow creates new function every render. Low cost; optional to fix with `useCallback`.

---

### 13. useTasks return value useMemo

**Location:** `useTasks.ts:327-339`

**Observation:** The hook returns a memoized object. Dependencies include `tasks`, `loading`, etc., so the object changes when data changes. That is expected. Callers should memoize their `onTaskAction` using the individual callbacks (`toggleComplete`, `editTask`, etc.) to avoid unnecessary downstream re-renders.

---

## Summary of Recommended Fixes (by impact)

| Priority | Fix | Files | Impact | Status |
|----------|-----|-------|--------|--------|
| High | Memoize `onTaskAction` object | Inbox, Today, TaskManager | Prevents all TaskItems re-rendering on parent render | **Done** |
| High | Remove `tasks` from `handleTaskToggle` deps (use ref) | Inbox, Today, TaskManager | Prevents cascade on every task list update | **Done** |
| High | useCallback for handleTaskDelete, handleTaskUpdate | Inbox, Today, TaskManager | Stabilizes onTaskAction | **Done** |
| High | Fix TaskList Row callbacks (extract TaskRow or use stable dispatcher) | TaskList | Enables TaskItem memo in virtualized list | **Done** |
| Medium | useCallback for TaskItem InlineTaskEditor handlers | TaskItem | Reduces re-renders when editing |
| Medium | Memoize TaskModal onClose/onSubmit | Inbox, Today | Reduces modal-related churn |
| Medium | React.memo(CompletedTaskItem) | CompletedTaskItem | Helps Completed page |
| Low | Split or narrow TaskMetadataContext | TaskMetadataContext | Reduces scope of metadata change re-renders |

---

## Verification

After applying fixes:

1. Use React DevTools Profiler to record interactions (toggle task, add task, scroll list).
2. Check "Render count" for `TaskItem` and `TaskList` Row.
3. Verify that toggling one task does not re-render all other TaskItems.
