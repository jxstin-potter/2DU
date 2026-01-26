# 2DU Task Manager

A task management application built with React, TypeScript, and Firebase.

## Features

- User authentication (signup/login/logout)
- Create, edit, and delete tasks
- Mark tasks as completed
- Task organization with tags and categories
- Multiple views (Today, Upcoming, Tags, Completed)
- Dark/Light theme toggle
- Keyboard shortcuts
- Settings management

## Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
4. Enable Email/Password Authentication in Firebase Console
5. Create a Firestore database
6. Start the development server: `npm run dev`

## Build

```bash
npm run build
```

Built files will be in the `dist` folder.
