# 2DU Task Manager

A **Todoist-inspired** task management app — full independent implementation with React, TypeScript, and Firebase. Built for clarity and recruiter-friendly context.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **UI** | React 18, TypeScript, Vite, MUI (Material UI), Emotion, Framer Motion |
| **State & data** | Redux Toolkit, TanStack Query (React Query), React Hook Form, Yup |
| **Backend** | Firebase (Auth, Firestore) |
| **UX** | react-beautiful-dnd, react-window (virtualization), date-fns, MUI X Date Pickers, Recharts |
| **Quality** | Jest, Testing Library, Cypress (e2e), MSW, cypress-axe (a11y) |

## Features

- **Auth** — Email/password signup, login, logout; protected routes
- **Tasks** — Create, edit, delete; due dates; priority; status (todo / in progress / review / done); subtasks; notes
- **Organization** — Tags, categories; drag-and-drop reorder
- **Views** — Inbox, Today, Upcoming, Completed; list virtualization where it matters
- **Search** — Global search (modal + shortcuts)
- **Settings** — Theme (dark/light), language (i18n), accessibility options
- **Keyboard shortcuts** — Quick actions and help modal
- **Error handling** — Error boundary, user-facing feedback

## Project structure (high level)

```
src/
├── components/     # auth, forms, layout, modals, task-management, ui, settings
├── contexts/       # Auth, Theme, I18n, A11y, TaskModal, SearchModal, WebSocket, etc.
├── hooks/          # useTasks, useTags, useCategories
├── pages/          # Login, Inbox, Today, Upcoming, Completed, Settings
├── services/       # Firebase-backed: tasks, tags, categories; websocket
├── types/          # task, user, tag, category, firestore
├── utils/          # taskHelpers, i18n, a11y, logging
├── config/         # Firestore rules & indexes
└── locales/        # i18n strings
```

## Setup

### Prerequisites

- Node.js v14+
- npm or yarn
- Firebase project (Auth + Firestore)

### Installation

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd 2DU-V4-3
   npm install
   ```

2. **Environment**  
   Copy `.env.example` to `.env` and fill in your [Firebase config](https://console.firebase.google.com/) (see `.env.example` for variable names).

3. **Firebase**
   - Enable **Email/Password** authentication.
   - Create a **Firestore** database.
   - Deploy rules and indexes from `src/config/` if you use the included ones.

4. **Run**
   ```bash
   npm run dev
   ```
   App runs at the URL Vite prints (e.g. `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |
| `npm test` | Jest unit tests |
| `npm run test:coverage` | Jest with coverage |
| `npm run test:e2e` | Cypress e2e (headless) |
| `npm run test:e2e:dev` | Cypress interactive |
| `npm run test:ci` | Jest + Cypress (CI-style) |

## Testing

- **Unit:** Jest + React Testing Library + MSW for API mocking.
- **E2E:** Cypress; e2e specs in `cypress/e2e/`, component specs in `cypress/component/`.
- **A11y:** cypress-axe used in Cypress flows.

## License

See [LICENSE](LICENSE).
