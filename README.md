# Task Tracker — React Frontend

A React SPA for the Task Tracker application. Consumes the Laravel REST API backend.

## Stack

- **Vite** — build tool & dev server
- **React 19** — UI
- **Tailwind CSS v4** — styling
- **TanStack Query v5** — server state, caching, mutations
- **Axios** — HTTP client

---

## Prerequisites

- Node.js 18+
- The Laravel API backend running at `http://localhost:8000`

---

## Install & run

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api → http://localhost:8000)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> The Vite dev server automatically proxies all `/api/*` requests to the Laravel backend, so no CORS configuration is needed during development.

---

## Build for production

```bash
npm run build
```

Static files are output to `dist/`. Serve them from any static host (Vercel, Netlify, S3, nginx, etc.).

### Configuring the API URL for production

In development the Vite proxy handles routing. In production you have two options:

**Option A — same origin** (API and frontend on the same domain): no changes needed; `/api/v1/...` requests will hit the same server.

**Option B — different origin** (separate domains): set a `VITE_API_BASE_URL` env variable and update [src/api/tasks.js](src/api/tasks.js):

```js
// src/api/tasks.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
})
```

Then create `.env.production`:

```
VITE_API_BASE_URL=https://api.yourproductiondomain.com/api/v1
```

Also update `allowed_origins` in the Laravel backend's `config/cors.php` to include your frontend domain.

---

## Project structure

```
src/
├── api/
│   └── tasks.js            # All API calls — the only file that knows about URLs
├── components/
│   ├── FilterBar.jsx        # Status filter buttons + debounced search input
│   ├── Pagination.jsx       # Prev/Next page controls
│   ├── StatsBar.jsx         # Total / Pending / Completed / Overdue counters
│   ├── TaskCard.jsx         # Single task row — toggle, edit, delete with confirm
│   ├── TaskForm.jsx         # Reusable create/edit form with client-side validation
│   ├── TaskList.jsx         # List of TaskCards + loading skeleton + empty state
│   └── TaskModal.jsx        # Accessible modal wrapper (Escape to close)
├── hooks/
│   ├── useDebounce.js       # 300ms debounce for search input
│   ├── useStats.js          # useQuery for /stats
│   ├── useTaskMutations.js  # create / update / delete / toggle mutations
│   └── useTasks.js          # useQuery for paginated task list
├── App.jsx                  # Root component — state, layout, modal orchestration
└── main.jsx                 # QueryClientProvider setup
```

---

## Features

| Feature | Detail |
|---|---|
| Stats bar | Live counts — auto-invalidated on any mutation |
| Task list | Paginated, sorted newest-first |
| Filter | All / Pending / Completed — resets to page 1 |
| Search | Debounced 300ms, searches title + description |
| Create | Modal form, client + server validation errors shown |
| Edit | Pre-filled modal form |
| Toggle | Optimistic update — UI flips immediately, rolls back on error |
| Delete | Two-click inline confirmation |
| Overdue | Red highlight on past-due pending tasks |
| Loading | Skeleton cards while fetching |
| Errors | Friendly message if API is unreachable |

---

## Assumptions

- The backend runs at `http://localhost:8000` during development.
- No authentication is implemented — add Laravel Sanctum + an auth flow if required.
- `is_overdue` is computed client-side for optimistic toggle UX; the backend also returns an `is_overdue` field which could be used instead.
