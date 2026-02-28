# AGENTS.md

## Cursor Cloud specific instructions

### Overview

2DU is a single-page React + TypeScript task management app backed by Firebase (Auth + Firestore). There is no custom backend server; all persistence and auth are handled by Firebase cloud services.

### Running the app

- `npm run dev` starts Vite dev server on **port 4000** (not the Vite default 5173).
- Firebase credentials are already in `.env` and `.env.development` (project `du-app-ff4ae`).
- **Production (GitHub Pages):** For the deployed app to use Firebase Auth/Firestore, add `jxstin-potter.github.io` to Firebase Console → Authentication → Authorized domains, and ensure production build has `VITE_FIREBASE_*` env vars (e.g. `.env.production`). See `docs/FIREBASE_PRODUCTION.md`.

### Key commands

See `README.md` "Scripts" table for full list. Summary:

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Unit tests | `npm test` |
| Build | `npm run build` |
| E2E tests | `npm run test:e2e` |

### Non-obvious caveats

- **Vite dev port vs Cypress `baseUrl`**: The dev server runs on port 4000 (`vite.config.ts` → `server.port`), but `cypress.config.ts` has `baseUrl: 'http://localhost:5173'`. If running Cypress E2E tests, either change the Cypress config or start the dev server on 5173.
- **`identity-obj-proxy`**: Required by `jest.config.cjs` for CSS module mocking but missing from `package.json`. It must be installed separately (`npm install --save-dev identity-obj-proxy`). The update script handles this.
- **`esbuild.drop` in `vite.config.ts`**: Console and debugger statements are stripped in dev mode. If you need `console.log` during development, temporarily remove or comment out the `drop: ['console', 'debugger']` line.
- **Jest test failures**: 3 tests in `TaskModal.test.tsx` fail due to a missing `TaskMetadataProvider` wrapper in the test utilities. This is a pre-existing issue, not an environment problem.
- **ESLint flat config**: Uses `eslint.config.js` (flat config format), not `.eslintrc`. The `@eslint/js` and `globals` packages are transitive deps of eslint v8 and are available after `npm install`.
