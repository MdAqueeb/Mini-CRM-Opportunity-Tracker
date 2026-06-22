# 🚀 CRM Opportunity Tracker - Backend API

A secure backend built using Node.js, Express, MongoDB, and JWT authentication.  
This service manages CRM-style sales opportunities with strict ownership-based authorization.

---

## 🧰 Tech Stack
Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors, morgan, swagger-ui-express

---

## 📁 Project Structure
backend/
├── src/
│   ├── config/        → DB connection
│   ├── controllers/   → Business logic (auth, opportunity)
│   ├── middleware/    → JWT auth + error handling
│   ├── models/        → Mongoose schemas (User, Opportunity)
│   ├── routes/        → API routes
│   ├── utils/         → JWT helper
│   ├── services/      → optional service layer
│   └── server.js      → entry point
├── .env
├── .env.example
├── package.json
└── README.md

---

## ⚙️ Setup Instructions

Clone repo:
git clone <repo-url>
cd backend

Install dependencies:
npm install

---

## 🔐 Environment Variables
Create .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_secret_key

---

## 🐳 Run MongoDB (Docker)

docker run -d --name crm-mongo -p 27017:27017 mongo

---

## ▶️ Start Server

npm run dev

Server runs at:
http://localhost:5000

---

## 🌐 API BASE URL
http://localhost:5000/api

---

## 🔐 AUTH APIs

POST /api/auth/register
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

---

POST /api/auth/login
Body:
{
  "email": "john@example.com",
  "password": "123456"
}

---

GET /api/auth/me
Headers:
Authorization: Bearer <token>

---

## 📊 OPPORTUNITY APIs (PROTECTED - JWT REQUIRED)

POST /api/opportunities
Body:
{
  "customerName": "ABC Corp",
  "contactName": "John",
  "contactEmail": "john@abc.com",
  "contactPhone": "9999999999",
  "requirement": "CRM system needed",
  "estimatedValue": 50000,
  "stage": "New",
  "priority": "High",
  "nextFollowUpDate": "2026-06-25",
  "notes": "Initial discussion done"
}

---

GET /api/opportunities

---

GET /api/opportunities/:id

---

PUT /api/opportunities/:id
Body:
{
  "stage": "Qualified",
  "priority": "Medium",
  "notes": "Updated after discussion"
}

---

DELETE /api/opportunities/:id

---

## 🔐 SECURITY RULES

- JWT required for all opportunity routes
- Passwords hashed using bcrypt
- Ownership validated in backend only
- owner field comes from JWT (NOT frontend)
- No user_id accepted from request body

---

## 📘 SWAGGER DOCS
http://localhost:5000/api-docs

Includes:
- Auth APIs
- Opportunity APIs
- JWT authentication support

---

## 🧠 BUSINESS LOGIC FLOW

Authentication:
User → Register → bcrypt hash → Login → JWT token → Protected routes

Opportunities:
User creates → backend assigns owner from token → only owner can update/delete → all users can view

---

## ⚠️ IMPORTANT NOTES

- Never commit .env file
- MongoDB must be running before server start
- JWT secret must be strong
- Backend enforces all security rules (frontend is NOT trusted)

---

## 🚀 FUTURE IMPROVEMENTS

Pagination, search, filtering, role-based access, logs, rate limiting, Docker compose

