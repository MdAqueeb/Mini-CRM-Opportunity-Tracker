# Mini CRM — Opportunity Tracker (MERN)

A secure full-stack MERN application to manage a shared CRM-style sales
opportunity pipeline. Users register/log in, create opportunities, and view the
whole team's pipeline — but can only edit or delete the opportunities they own.
Ownership is enforced on the backend, never trusted from the client.

## Live demo

| Service  | URL |
| -------- | --- |
| **Frontend** | https://mini-crm-opportunity-tracker-taupe.vercel.app |
| **Backend (API)** | https://mini-crm-opportunity-tracker-gq5b.onrender.com/api |
| **API docs (Swagger)** | https://mini-crm-opportunity-tracker-gq5b.onrender.com/api-docs |

**Test login** (either account, password `password123`):
`alice@crm.com` · `ben@crm.com`

> The backend runs on Render's free tier, which sleeps after inactivity — the
> first request may take ~50s to wake up.

## Tech stack

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, Zod
(validation), Swagger (API docs).
**Frontend:** React (Vite), React Router, Axios, React Hook Form + Zod,
React Toastify, Tailwind CSS, Context API for auth state.

## Repository structure

```
.
├── backend/    Express + MongoDB REST API
└── frontend/   React (Vite) client
```

Each package has its own README with deeper details:
[backend/README.md](backend/README.md) · [frontend/README.md](frontend/README.md).

## Backend setup

```bash
cd backend
npm install
cp .env.example .env      # fill in the values below
npm run dev               # http://localhost:5000
```

API base URL: `http://localhost:5000/api` · Swagger docs: `/api-docs`.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env      # set VITE_API_URL to the backend URL
npm run dev               # http://localhost:5173
```

## Environment variables

**backend/.env**

| Variable     | Description                                                     |
| ------------ | -------------------------------------------------------------- |
| `PORT`       | Server port for local dev (e.g. `5000`). Hosts set this themselves. |
| `MONGO_URI`  | MongoDB connection string (Atlas/local)                        |
| `JWT_SECRET` | Secret used to sign JWTs (keep private)                         |
| `CLIENT_URL` | Deployed frontend origin; locks CORS to it. Blank = open (dev) |
| `API_URL`    | Public API base URL shown in Swagger. Blank = localhost (dev)  |

**frontend/.env**

| Variable       | Description                                 |
| -------------- | ------------------------------------------- |
| `VITE_API_URL` | Backend API base URL, e.g. `.../api`        |

> Never commit real `.env` files. Only `.env.example` templates are tracked.

## API summary

Base URL: `/api`

| Method | Endpoint                  | Access            |
| ------ | ------------------------- | ----------------- |
| POST   | `/auth/register`          | Public            |
| POST   | `/auth/login`             | Public            |
| GET    | `/auth/me`                | Authenticated     |
| GET    | `/opportunities`          | Authenticated     |
| POST   | `/opportunities`          | Authenticated     |
| GET    | `/opportunities/:id`      | Authenticated     |
| PUT    | `/opportunities/:id`      | Owner only        |
| DELETE | `/opportunities/:id`      | Owner only        |

- Token is sent as `Authorization: Bearer <token>` and expires in 2 hours.
- The opportunity `owner` is derived from the JWT — `user_id`/`created_by` are
  never read from the request body.
- Update/delete enforce ownership in the backend (403 otherwise), independent of
  the UI hiding the buttons.

## Deployment

The app is designed to deploy as two services plus a hosted database:

1. **Database** — create a free cluster on MongoDB Atlas, copy its connection
   string into the backend `MONGO_URI`.
2. **Backend** — deploy `backend/` to Render or Railway (root dir `backend`,
   start command `npm start`). Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
   (your frontend URL), and optionally `API_URL`. Do **not** set `PORT` — the
   host provides it.
3. **Frontend** — deploy `frontend/` to Vercel or Netlify. Set `VITE_API_URL` to
   the deployed backend's `/api` URL. Build command: `npm run build`,
   output dir: `dist`.

CORS is locked to the frontend origin in production via the `CLIENT_URL` env
var (falls back to open for local dev when unset).

This project is deployed as:

| Service  | Platform | URL |
| -------- | -------- | --- |
| Frontend | Vercel   | https://mini-crm-opportunity-tracker-taupe.vercel.app |
| Backend  | Render   | https://mini-crm-opportunity-tracker-gq5b.onrender.com |
| Database | MongoDB Atlas | hosted cluster |

## Known limitations / pending improvements

- `GET /api/opportunities` returns the full list; pagination, search, sorting and
  filtering are implemented **client-side** in the dashboard. Moving these
  server-side would scale better for large pipelines.
- No automated tests yet (auth + ownership are the highest-value targets).
- No Docker setup.
- Render's free tier cold-starts after inactivity (~50s first request).
```
