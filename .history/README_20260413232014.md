# Client Work Management System (Full Stack)

This project is an internal work management platform where teams can manage clients and track tasks in one place.

It includes two applications:

- client-work-backend: API and business logic
- frontend: web dashboard for day-to-day usage

## Repository Structure

```text
.
├── client-work-backend/
├── frontend/
└── README.md
```

## Core Functionality

### 1) Authentication
- Admin login
- Secure session handling
- Protected routes and API access

### 2) Client Management
- Add new clients
- Edit existing client details
- Delete clients
- Search clients by name, email, or company

### 3) Task Management
- Create and update tasks
- Assign tasks to clients
- Set status, priority, and due date
- Delete tasks

### 4) Dashboard
- Overview cards for key metrics
- Recent work visibility
- Quick monitoring of progress

### 5) Responsive Experience
- Works across desktop, tablet, and mobile
- Consistent UI components and form validations

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form + Zod

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

## Project Goal

Provide a clean, reliable internal tool for small teams to:

- Organize clients
- Track ongoing work
- Keep task status clear
- Improve day-to-day execution visibility
