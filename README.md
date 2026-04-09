# Frontend (React + Vite)

This is the frontend for the task tracker application.

## Setup Instructions

### 1) Prerequisites
- Node.js 20+ (LTS recommended)
- npm 10+

### 2) Install dependencies
```bash
npm install
```

### 3) Configure environment
Create `.env` from `.env.example` and fill in Firebase values:

```bash
cp .env.example .env
```

Required variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional variable:
- `VITE_API_BASE_URL` (leave empty in local development to use Vite proxy)

### 4) Run locally
```bash
npm run dev
```

The app runs on Vite dev server and proxies `/api` calls to `http://localhost:8000`, so the backend should be running locally.

## Decisions Made

- Chose React + Vite for fast local iteration and a simple build setup.
- Used Firebase Auth on the client and exchanged Firebase ID tokens for backend Sanctum tokens.
- Stored the backend auth token in `localStorage` to persist sessions across reloads.
- Used React Query for async server state (tasks, stats, mutations) and request lifecycle handling.
- Kept API base URL configurable with `VITE_API_BASE_URL`, while defaulting to `/api/v1` for local proxy-based development.

## What I Would Improve With More Time

- Add end-to-end tests for auth and task flows (login, create/update/delete task, filters).
- Improve error and loading UX consistency across all views.
- Add stricter input validation and better client-side feedback for edge cases.
- Split larger components into smaller reusable pieces to simplify maintenance.
- Add stronger accessibility coverage (keyboard interactions, focus states, screen reader labels).
