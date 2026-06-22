# CRM Opportunity Tracker — Frontend

React (Vite) frontend for the Mini CRM Opportunity Tracker. Talks to the
existing Express/MongoDB backend. Auth state is managed with the **Context API**
(no Redux).

## Tech stack

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Build tool     | Vite                            |
| UI             | React 18 + Tailwind CSS         |
| Routing        | React Router DOM v6             |
| Forms          | React Hook Form + Zod           |
| HTTP           | Axios (instance + interceptors) |
| Notifications  | React Toastify                  |
| Auth state     | Context API (`AuthContext`)     |

## Getting started

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev            # http://localhost:5173
```

The backend must be running (default `http://localhost:5000/api`). CORS is open
on the backend, so no proxy is needed.

## Folder structure

```
src/
  components/   Reusable, presentational building blocks
                (Navbar, Button, Input, Modal, Loader,
                 OpportunityCard, OpportunityForm, SkeletonCard)
  context/      AuthContext — global auth state + persistence
  pages/        Route-level screens (Login, Register, Dashboard,
                Create/Edit/Details, NotFound)
  routes/       ProtectedRoute — guards private routes
  services/     api.js — Axios instance, interceptors, API calls
  utils/        constants.js (enums/tokens), helpers.js (formatters)
  styles/       global.css — Tailwind layers + design-system classes
  App.jsx       Route table + layout
  main.jsx      App bootstrap (Router, AuthProvider, ToastContainer)
```

- **components/** — dumb, reusable UI. No data fetching; they take props.
- **pages/** — own data fetching and orchestration for one route.
- **context/** — app-wide state that many components need (auth).
- **services/** — the only place that knows about HTTP/endpoints, so the API
  surface can change in one file.
- **routes/** — routing concerns (guards) kept separate from screens.
- **utils/** — pure, testable helpers and the single source of truth for enums.

## Auth & session persistence

- On **login**, the JWT is stored in `localStorage` under `crm_token` and the
  user object under `crm_user`.
- The Axios **request interceptor** attaches `Authorization: Bearer <token>` to
  every request automatically.
- On **app load**, `AuthContext` hydrates from `localStorage` and then calls
  `GET /auth/me` to confirm the token is still valid (it expires in 2h on the
  backend). If invalid, it logs out.
- The Axios **response interceptor** broadcasts an `auth:logout` event on any
  unexpected `401`, which `AuthContext` listens for to clear state app-wide —
  so an expired token anywhere bounces the user to `/login`.
- `ProtectedRoute` shows a loader during the restore check (no redirect flash),
  then redirects unauthenticated users to `/login`, remembering where they were
  headed.

## Routes

| Path                    | Access    | Screen              |
| ----------------------- | --------- | ------------------- |
| `/login`                | public    | Login               |
| `/register`             | public    | Register            |
| `/dashboard`            | protected | Opportunity list    |
| `/create-opportunity`   | protected | Create form         |
| `/edit-opportunity/:id` | protected | Edit form (owner)   |
| `/opportunity/:id`      | protected | Details + delete    |
| `*`                     | any       | 404 NotFound        |

## Design system

Defined once in `tailwind.config.js` + `styles/global.css`, reused via utilities.

- **Colors:** primary `#2563eb`, secondary `#1e293b`, background `#f8fafc`,
  success `#22c55e`, warning `#f59e0b`, danger `#ef4444`.
- **Typography:** Inter; `.h1` 32px bold, `.h2` 24px semibold, body 14–16px,
  small 12px.
- **Spacing:** Tailwind's 4px scale used in 8 / 16 / 24 / 32 increments
  (`gap-2`, `p-4`, `py-6`, `p-8`).
- **Surfaces:** `.card` class for consistent white panels.

## Notes on the backend contract

These shaped some deliberate frontend decisions:

1. **No server-side pagination/filtering.** `GET /api/opportunities` returns the
   full list (`{ success, count, data[] }`). Search, stage/priority filters,
   sorting and pagination are therefore computed **client-side** in the
   Dashboard with `useMemo`.
2. **Limited update fields.** `PUT /api/opportunities/:id` only persists
   `stage`, `priority`, `nextFollowUpDate`, `estimatedValue`, `notes`. The Edit
   form shows the identity fields (customer/requirement/contact) read-only so
   the UI never implies an edit that the API silently ignores.
3. **Register returns no token**, so after a successful registration the app
   immediately logs in for a one-step signup flow.

## UX

- Skeleton loaders while opportunities load; empty states for no data / no
  matches; toast notifications (top-right, auto-dismiss 4s, closeable).
- Own opportunities are highlighted (left accent bar + "You" badge).
- Owner-only Edit/Delete actions; delete behind a confirmation modal.
- Fully responsive (mobile-first grid, collapsing navbar).
```
