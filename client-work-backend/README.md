# Client Work Management System — Backend API

A production-quality REST API built with **Node.js, Express.js, and MongoDB** for managing clients and their tasks internally.

---

## 📁 Project Structure

```
client-work-backend/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── jwt.js              # JWT config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── client.controller.js
│   │   ├── task.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── rateLimiter.js      # Rate limiting
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Client.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── index.js            # Route aggregator
│   │   ├── auth.routes.js
│   │   ├── client.routes.js
│   │   ├── task.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── client.service.js
│   │   └── task.service.js
│   ├── utils/
│   │   ├── helpers.js          # AppError, asyncHandler, sendSuccess/Error
│   │   ├── jwt.js              # Token helpers + cookie options
│   │   └── seed.js             # Admin seeder
│   ├── validators/
│   │   └── index.js            # All input validators
│   ├── app.js                  # Express app
│   └── server.js               # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Seed the admin account

```bash
npm run seed
```

This creates the initial admin using values from your `.env` file.

### 4. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 🔐 Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `NODE_ENV` | ✅ | Runtime environment | `development` or `production` |
| `PORT` | ✅ | Server port | `5000` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access tokens (min 32 chars) | `a_long_random_string_here` |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens (min 32 chars) | `another_long_random_string` |
| `JWT_ACCESS_EXPIRES_IN` | ✅ | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token lifetime | `7d` |
| `COOKIE_SECURE` | ✅ | Set `true` in production (HTTPS only) | `false` |
| `CLIENT_URL` | ✅ | Frontend origin for CORS | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | ❌ | Rate limit window in ms | `900000` (15 min) |
| `RATE_LIMIT_MAX` | ❌ | Max requests per window | `100` |
| `SEED_ADMIN_NAME` | ❌ | Admin name for seed script | `Admin` |
| `SEED_ADMIN_EMAIL` | ❌ | Admin email for seed script | `admin@company.com` |
| `SEED_ADMIN_PASSWORD` | ❌ | Admin password for seed script | `Admin@123456` |

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Description of result",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": "error message" }
}
```

---

## 🔑 Auth Routes

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | Admin login |
| `POST` | `/api/auth/refresh` | ❌ (cookie) | Refresh access token |
| `POST` | `/api/auth/logout` | ✅ | Logout and clear token |
| `GET` | `/api/auth/me` | ✅ | Get current admin profile |

### POST `/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "Admin@123456"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "admin": {
      "id": "64a1b...",
      "name": "Admin",
      "email": "admin@company.com"
    }
  }
}
```
> 🍪 Also sets `refreshToken` as an **HttpOnly cookie**

---

### POST `/api/auth/refresh`

No body needed. Reads the `refreshToken` cookie automatically.

**Response `200`:**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

---

### GET `/api/auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Admin profile fetched",
  "data": {
    "admin": {
      "_id": "64a1b...",
      "name": "Admin",
      "email": "admin@company.com",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

## 👤 Client Routes

All routes require: `Authorization: Bearer <accessToken>`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/clients` | Get all clients (paginated) |
| `POST` | `/api/clients` | Create a client |
| `GET` | `/api/clients/:id` | Get client by ID |
| `PATCH` | `/api/clients/:id` | Update client |
| `DELETE` | `/api/clients/:id` | Delete client + all their tasks |
| `GET` | `/api/clients/:id/tasks` | Get client + their tasks |
| `GET` | `/api/clients/:id/stats` | Get task stats for a client |

### GET `/api/clients` — Query Parameters

| Param | Type | Description | Example |
|---|---|---|---|
| `search` | string | Search by name, email, or company | `?search=acme` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 20) | `?limit=10` |
| `isActive` | boolean | Filter by active status | `?isActive=true` |

**Response `200`:**
```json
{
  "success": true,
  "message": "Clients fetched successfully",
  "data": {
    "clients": [ { ... } ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### POST `/api/clients`

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "companyName": "Sharma & Co.",
  "phone": "+91 9876543210",
  "notes": "GST filing client"
}
```

> `name` and `email` are **required**. All others are optional.

**Response `201`:**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "client": {
      "_id": "64a...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "companyName": "Sharma & Co.",
      "phone": "+91 9876543210",
      "notes": "GST filing client",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

### GET `/api/clients/:id/tasks`

**Response `200`:**
```json
{
  "success": true,
  "message": "Client details fetched successfully",
  "data": {
    "client": { "_id": "...", "name": "Rahul Sharma", ... },
    "tasks": [ { "_id": "...", "title": "File ITR", "status": "Pending", ... } ]
  }
}
```

---

### GET `/api/clients/:id/stats`

**Response `200`:**
```json
{
  "success": true,
  "message": "Client stats fetched successfully",
  "data": {
    "stats": {
      "total": 5,
      "Pending": 2,
      "In Progress": 1,
      "Completed": 2
    }
  }
}
```

---

## ✅ Task Routes

All routes require: `Authorization: Bearer <accessToken>`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (paginated, filterable) |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `PATCH` | `/api/tasks/:id` | Update task (full edit) |
| `PATCH` | `/api/tasks/:id/status` | Update task status only |
| `DELETE` | `/api/tasks/:id` | Delete task |

### GET `/api/tasks` — Query Parameters

| Param | Type | Description | Example |
|---|---|---|---|
| `status` | string | Filter by status | `?status=Pending` |
| `client` | string | Filter by client ID | `?client=64a1b...` |
| `priority` | string | Filter by priority | `?priority=High` |
| `search` | string | Search title/description | `?search=ITR` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=20` |

**Valid status values:** `Pending` | `In Progress` | `Completed`

**Valid priority values:** `Low` | `Medium` | `High`

---

### POST `/api/tasks`

**Request Body:**
```json
{
  "title": "File ITR for FY 2024-25",
  "description": "Gather Form 16, compute income, file on portal",
  "status": "Pending",
  "priority": "High",
  "client": "64a1b2c3d4e5f6g7h8i9j0",
  "dueDate": "2025-07-31T00:00:00.000Z"
}
```

> `title` and `client` are **required**. `status` defaults to `Pending`. `priority` defaults to `Medium`.

---

### PATCH `/api/tasks/:id/status`

Use this for quick kanban-style status updates.

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "File ITR...",
      "status": "In Progress",
      "client": { "_id": "...", "name": "Rahul Sharma", ... },
      ...
    }
  }
}
```

---

## 📊 Dashboard Route

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | ✅ | Aggregated stats + recent activity |

### GET `/api/dashboard`

**Response `200`:**
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "stats": {
      "totalClients": 12,
      "totalTasks": 48,
      "pendingTasks": 15,
      "inProgressTasks": 8,
      "completedTasks": 25
    },
    "recentTasks": [
      {
        "_id": "...",
        "title": "File ITR for FY 2024-25",
        "status": "Pending",
        "priority": "High",
        "dueDate": "2025-07-31T00:00:00.000Z",
        "createdAt": "...",
        "client": {
          "_id": "...",
          "name": "Rahul Sharma",
          "companyName": "Sharma & Co.",
          "email": "rahul@example.com"
        }
      }
    ],
    "recentClients": [
      {
        "_id": "...",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "companyName": "Sharma & Co.",
        "createdAt": "..."
      }
    ]
  }
}
```

---

## ❤️ Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | ❌ | Server status check |

---

## 🔐 Authentication Flow for Frontend

```
1. User submits login form
   POST /api/auth/login → { accessToken, admin }
   (refreshToken saved as HttpOnly cookie automatically)

2. Store accessToken in memory (React state or Zustand)
   ⚠️ Do NOT store in localStorage

3. Attach to every protected request:
   Headers: { Authorization: "Bearer <accessToken>" }

4. When accessToken expires (401 response):
   POST /api/auth/refresh → { accessToken }
   (cookie sent automatically by browser)
   Retry the original request with new token

5. On logout:
   POST /api/auth/logout
   Clear accessToken from state
```

---

## 🗂️ Data Models Reference

### Admin
```
_id, name, email, password (hashed), refreshToken, createdAt, updatedAt
```

### Client
```
_id, name, email, companyName, phone, notes, isActive, createdAt, updatedAt
```

### Task
```
_id, title, description, status, priority, dueDate, client (→ Client._id), createdAt, updatedAt
```

---

## ⚠️ Error Codes

| Code | Meaning |
|---|---|
| `400` | Bad Request / Validation failed |
| `401` | Unauthorized / Token expired or invalid |
| `404` | Resource not found |
| `409` | Conflict (e.g., duplicate email) |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |

---

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set `COOKIE_SECURE=true` (requires HTTPS)
- [ ] Use strong, unique JWT secrets (64+ chars)
- [ ] Set `CLIENT_URL` to your deployed frontend URL
- [ ] Change default admin password after first login
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set up process manager (PM2)
