# Firebase configuration for production (GitHub Pages)

For the deployed app at **https://jxstin-potter.github.io/2DU/** to communicate with Firebase (Auth + Firestore), do the following.

## 1. Authorized domains (required for Auth)

Firebase Auth only allows requests from domains you explicitly authorize.

1. Open [Firebase Console](https://console.firebase.google.com/) → project **du-app-ff4ae**.
2. Go to **Authentication** → **Settings** (or **Sign-in method** tab) → **Authorized domains**.
3. Add:
   - **`jxstin-potter.github.io`**
4. Save.

Without this, sign-in (email/password, Google, Apple) will fail on the deployed site with errors like “unauthorized domain” or blocked redirects.

## 2. Environment variables at build time

Vite inlines `VITE_*` env vars at **build** time. The production build (used by `npm run deploy`) must see your Firebase config.

- **Option A (recommended):** Use a `.env.production` file (copy from `.env.production.example`) and fill in the same values as in `.env` / `.env.development`. Do not commit real keys; use `.env.production.local` and keep it gitignored if needed.
- **Option B:** Run `npm run build` (or `npm run deploy`) in an environment where `.env` is present with all `VITE_FIREBASE_*` variables set.

If any required `VITE_FIREBASE_*` value is missing, the build will throw before deploy.

## 3. Firestore rules

Rules in `firestore.rules` are already correct for production (they rely on `request.auth`). Deploy them when you change rules:

```bash
npm run deploy:rules
```

## 4. authDomain

Keep **authDomain** as your Firebase Auth domain (e.g. `du-app-ff4ae.firebaseapp.com`). You do **not** set it to the GitHub Pages URL; authorized domains (step 1) control which front-end origins can use Auth.

## Summary checklist

- [ ] **Authorized domains:** `jxstin-potter.github.io` added in Firebase Console → Authentication → Authorized domains.
- [ ] **Build env:** `.env.production` or `.env` (or CI secrets) contains all `VITE_FIREBASE_*` variables when running `npm run build` / `npm run deploy`.
- [ ] **Firestore rules:** Deployed with `npm run deploy:rules` when rules change.
