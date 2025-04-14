# 2DU Task Manager - MVP

A simple task management application built with React, TypeScript, and Firebase.

## Features (MVP)

- User Authentication (signup/login/logout)
- Create Tasks with title and description
- List Tasks in a simple UI
- Mark Tasks as completed
- Delete Tasks
- Dark/Light theme toggle

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Email/Password Authentication:
   - Go to Authentication > Sign-in method > Email/Password > Enable
3. Create a Firestore database:
   - Go to Firestore Database > Create database
   - Start in production mode
   - Choose a location close to your users

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace all values with your Firebase project settings found in the Firebase console under Project settings > General > Your apps > Firebase SDK snippet > Config.

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
4. Open http://localhost:5173 in your browser

## Deployment

To build the application for production:

```
npm run build
```

or

```
yarn build
```

The built files will be in the `dist` folder.

## CSS Architecture

The application uses a well-structured CSS approach:

- **Global Stylesheet**: All general styles (resets, variables, base typography, animations, and utility classes) are consolidated in `src/styles/global.css`, which is imported in the root component.

- **CSS Modules**: Component-specific styles are implemented using CSS Modules (`.module.css` files) to ensure style encapsulation and prevent class name collisions. This approach is used for reusable components like `CustomCheckbox` and `EmptyState`.

- **MUI Integration**: The app uses Material UI (MUI) components with a customized theme defined in `src/styles/theme.ts`. This allows for consistent styling across components while leveraging MUI's component library.

- **CSS Variables**: Theme colors, spacing, and other design tokens are defined as CSS variables in the global stylesheet, allowing for easy theming and consistent styling.

- **Animation System**: Keyframe animations and animation utility classes are centralized in the global stylesheet, promoting reuse and consistency.

- **Responsive Design**: The stylesheet includes responsive breakpoints and utilities to ensure the application works well on different screen sizes.

## Future Improvements (Beyond MVP)

- Subtasks
- Due dates
- Priority levels
- Tags/Categories
- Task filtering
- Task attachments
- Task sharing
- Mobile responsiveness improvements
- Advanced analytics
