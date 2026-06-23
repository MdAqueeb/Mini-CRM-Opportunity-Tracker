# Mini CRM — Opportunity Tracker (MERN)

A secure full-stack MERN application to manage a shared CRM-style sales
opportunity pipeline. Users register/log in, create opportunities, and view the
whole team's pipeline — but can only edit or delete the opportunities they own.
Ownership is enforced on the backend, never trusted from the client.

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

| Variable     | Description                              |
| ------------ | ---------------------------------------- |
| `PORT`       | Server port (e.g. `5000`)                |
| `MONGO_URI`  | MongoDB connection string (Atlas/local)  |
| `JWT_SECRET` | Secret used to sign JWTs (keep private)  |

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
2. **Backend** — deploy `backend/` to Render or Railway. Set `MONGO_URI`,
   `JWT_SECRET`, and `PORT` as environment variables. Start command: `npm start`.
3. **Frontend** — deploy `frontend/` to Vercel or Netlify. Set `VITE_API_URL` to
   the deployed backend's `/api` URL. Build command: `npm run build`,
   output dir: `dist`.

> CORS is currently open (`cors()`) on the backend. For production you may want
> to restrict it to the deployed frontend origin.

**Live URLs**

| Service  | URL          |
| -------- | ------------ |
| Frontend | _add link_   |
| Backend  | _add link_   |

## Known limitations / pending improvements

- `GET /api/opportunities` returns the full list; pagination, search, sorting and
  filtering are implemented **client-side** in the dashboard. Moving these
  server-side would scale better for large pipelines.
- No automated tests yet (auth + ownership are the highest-value targets).
- No Docker setup.
- CORS is open and should be locked to the frontend origin in production.
```
