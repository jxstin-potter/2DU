 # Performance Review: Re-renders & Unnecessary Computations

## Executive summary

The codebase has several patterns that cause **unnecessary re-renders** and **unstable references**, especially in task lists and context consumers. Fixing context provider values and stabilizing callback props passed into list components will have the largest impact.

---

## 1. Context provider values (high impact)

### 1.1 TaskModalContext — new object every render

**File:** `src/contexts/TaskModalContext.tsx`

```tsx
return (
  <TaskModalContext.Provider value={{ isOpen, openModal, closeModal }}>
```

The value is an **inline object**, so a new reference is created every time the provider renders. Every consumer of `useTaskModal()` re-renders on any parent update, even when `isOpen`, `openModal`, and `closeModal` are unchanged.

**Fix:** Memoize the context value:

```tsx
const value = useMemo(
  () => ({ isOpen, openModal, closeModal }),
  [isOpen, openModal, closeModal]
);
return <TaskModalContext.Provider value={value}>{children}</TaskModalContext.Provider>;
```

---

### 1.2 SearchModalContext — same issue

**File:** `src/contexts/SearchModalContext.tsx`

```tsx
<SearchModalContext.Provider value={{ isOpen, openModal, closeModal, recentViews, recordRecentView }}>
```

Again, a new object every render. Sidebar, MainLayout, and any component using `useSearchModal()` re-render whenever the provider’s parent re-renders.

**Fix:** Memoize with `useMemo` and the same dependencies as the object keys.

---

## 2. Unstable callbacks / props into lists (high impact)

### 2.1 TaskManager — `onTaskAction` and related props

**File:** `src/components/task-management/TaskManager.js` (and `.tsx` if used)

TaskList receives:

- `onTaskAction: { toggle, delete, update, edit }` — **new object every render**
- `onCreateTask`, `onClose` for TaskModal — **new function references every render**
- `onDragEnd` for DragDropContext — **inline function**

Handlers like `handleTaskSelect`, `handleTaskUpdate`, `handleTaskDelete`, `handleTaskToggle`, `handleCreateTask`, etc. are **not wrapped in `useCallback`**. So on every TaskManager render:

1. A new `onTaskAction` object is created.
2. TaskList’s `handleTaskAction` (which depends on `onTaskAction`) is recreated.
3. TaskList’s `Row` (which depends on `handleTaskAction`) is recreated.
4. `FixedSizeList` gets a new `Row` every time → **all visible rows re-render**.

**Fix:**

- Wrap every handler passed to TaskList or TaskModal in `useCallback` with the correct dependencies (`user?.id`, `tasks` only where needed, etc.).
- Build `onTaskAction` once with `useMemo` from those stable callbacks, e.g.:

  ```tsx
  const onTaskAction = useMemo(
    () => ({
      toggle: handleTaskToggle,
      delete: handleTaskDelete,
      update: handleTaskUpdate,
      edit: handleTaskEdit,
    }),
    [handleTaskToggle, handleTaskDelete, handleTaskUpdate, handleTaskEdit]
  );
  ```

- Pass a stable `onDragEnd` (e.g. `const onDragEnd = useCallback((result) => { ... }, [handleReorder]);`).

---

### 2.2 Today page — same pattern

**File:** `src/pages/Today.js`

TodayView receives:

- `onTaskAction: { toggle, delete, update, edit }` — **new object every render**
- `handleCreateTask`, modal `onClose` / `onSubmit` — **new functions every render**

`handleTaskToggle`, `handleTaskDelete`, `handleTaskUpdate`, `handleCreateTask`, and the inline `edit: (task) => setSelectedTask(task)` are not memoized. So every Today render recreates `onTaskAction` and all callbacks → TodayView and all its TaskItems re-render.

**Fix:** Same as TaskManager: `useCallback` for all handlers, `useMemo` for `onTaskAction`, and stable modal callbacks.

---

### 2.3 MainLayout — Sidebar props

**File:** `src/components/layout/MainLayout.js`

```tsx
<Sidebar
  onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
  ...
/>
```

`onToggleCollapse` is an **inline function** → new reference every MainLayout render → Sidebar re-renders even when nothing else changed.

**Fix:**

```tsx
const handleToggleCollapse = useCallback(() => {
  setIsSidebarCollapsed(prev => !prev);
}, []);
// Pass handleToggleCollapse to Sidebar
```

---

## 3. useTasks hook (high impact)

**File:** `src/hooks/useTasks.ts`

- `editTask` is a **plain async function**, not wrapped in `useCallback`. It is included in the dependency array of the final `useMemo` that returns the hook’s API. So the returned object is **new every render** → any component that calls `useTasks()` re-renders whenever the hook’s component re-renders, even when `tasks`, `loading`, `error`, etc. are unchanged.

**Fix:** Wrap `editTask` in `useCallback` with `[user]` (and any other needed deps), and include it in the `useMemo` dependency array as now. That keeps the hook’s return value stable when inputs are unchanged.

---

## 4. FeedbackContainer — mutation and recomputation (medium)

**File:** `src/components/ui/UserFeedback.tsx`

```tsx
const latestFeedbacks = Object.values(groupedFeedbacks).map((group) =>
  group.sort((a, b) => b.timestamp - a.timestamp)[0]
);
```

- `Array.prototype.sort` **mutates** `group`. Those arrays come from `groupedFeedbacks`, which is derived from `feedbacks` (provider state). Mutating derived data can lead to subtle bugs and makes React’s state assumptions invalid.
- `groupedFeedbacks` and `latestFeedbacks` are recomputed on **every** FeedbackContainer render.

**Fix:**

- Do not mutate: `group.slice().sort(...)` or sort a copy.
- Optionally memoize: `const latestFeedbacks = useMemo(() => { ... }, [feedbacks]);` so we only recompute when `feedbacks` changes.

---

## 5. TodayView — midnight timeout ref (low)

**File:** `src/components/task-management/TodayView.tsx`

```tsx
useEffect(() => {
  const timeoutRef = { current: scheduleNextMidnight() };
  // ...
  return () => clearTimeout(timeoutRef.current);
}, []);
```

A plain object is used to hold the timeout ID. With an empty dependency array this works, but it’s brittle: if the effect ever gets dependencies, the ref would be recreated and the cleanup might not match the latest timeout. Using `useRef` makes the intent clear and keeps cleanup correct if the effect is later changed.

**Fix:** Declare `const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);` outside the effect, set `timeoutRef.current = scheduleNextMidnight()` inside, and clear it in the cleanup.

---

## 6. Sidebar — mainMenuItems recreated every render (low–medium)

**File:** `src/components/layout/Sidebar.js`

```js
var mainMenuItems = [
  { text: t('sidebar.today'), icon: <InboxIcon />, path: "/today" },
  // ...
];
```

This array (and the JSX inside) is recreated on every Sidebar render. When used in `mainMenuItems.map(renderMenuItem)` it can contribute to extra work and child reconciliation.

**Fix:** Memoize with `useMemo` depending on `t` and any other dynamic values (e.g. `mainMenuItems = useMemo(() => [...], [t])`). If `t` from I18n is stable, the list becomes stable.

---

## 7. TaskItem category lookup (correctness / consistency)

**Files:** `src/components/task-management/TaskItem.tsx` / `TaskItem.js`

TaskItem uses `task.category` for the category lookup:

```tsx
categories.find(c => c.id === task.category)
```

Elsewhere (e.g. TodayView, TaskManager) the code uses `task.categoryId`. The Task type and `taskHelpers` support both `categoryId` and `category`. If Firestore or the rest of the app standardizes on `categoryId`, TaskItem would show no category.

**Fix:** Use the same shape as the rest of the app, e.g. `const categoryId = task.categoryId ?? task.category;` and then `categories.find(c => c.id === categoryId)`, and depend on `task.categoryId` and `task.category` in the same `useMemo` if needed.

---

## 8. TaskModal — debug / agent logging (performance & noise)

**File:** `src/components/modals/TaskModal.js`

There are `useEffect` hooks that fire on every `title` and `dueDate` change and send data to `http://127.0.0.1:7246/ingest/...`. These:

- Run on every keystroke / date change in the modal.
- Add network and CPU overhead.
- Are likely for debugging and should not run in production.

**Fix:** Remove or guard with `import.meta.env.DEV` (or similar) so they only run in development.

---

## 9. What’s already in good shape

- **AuthContext, ThemeContext, I18nContext, FeedbackProvider:** Context values are memoized with `useMemo`.
- **TaskItem:** Wrapped in `React.memo` with good use of `useMemo` / `useCallback` for derived values and event handlers.
- **TaskList:** Uses `useCallback` for `Row` and scroll handler; filtering/sorting uses `useMemo`. The main issue is the **unstable `onTaskAction`** from the parent.
- **App.tsx:** Theme is memoized with `useMemo(() => getTheme(mode), [mode])`.
- **MainLayout:** `sidebarWidth`, `mainContentStyles`, and `appBarStyles` are memoized.

---

## 10. Recommended order of fixes

1. **TaskModalContext & SearchModalContext** — add `useMemo` for provider value (small change, fewer consumer re-renders).
2. **useTasks** — wrap `editTask` in `useCallback` so the hook’s return value is stable.
3. **TaskManager** — wrap all handlers in `useCallback`, build stable `onTaskAction` with `useMemo`, stable `onDragEnd`.
4. **Today page** — same as TaskManager for handlers and `onTaskAction`.
5. **MainLayout** — stable `onToggleCollapse` with `useCallback`.
6. **UserFeedback FeedbackContainer** — avoid mutating with `.sort()` (use a copy) and optionally memoize `latestFeedbacks`.
7. **TodayView** — use `useRef` for the midnight timeout.
8. **Sidebar** — memoize `mainMenuItems`.
9. **TaskItem** — use `task.categoryId ?? task.category` for category lookup.
10. **TaskModal** — remove or gate debug logging.

Implementing 1–5 will address the main sources of unnecessary re-renders (context and list parent → list → rows). The rest improve correctness, maintainability, and smaller wins.
