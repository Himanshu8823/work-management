# Client Work Management System - Frontend

A production-quality React frontend for managing clients and tracking work tasks.

## 🚀 Tech Stack

- **React 18** with Vite
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **TanStack Query** for state management and data fetching
- **React Hook Form** for form management
- **Zod** for schema validation
- **React Router** for navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/               # Authentication components
│   ├── common/             # Shared components (Loading, etc.)
│   ├── layout/             # Layout components (Header, Sidebar)
│   └── ui/                 # shadcn/ui components
├── features/
│   ├── auth/               # Auth forms
│   ├── clients/            # Client-specific components
│   └── tasks/              # Task-specific components
├── hooks/                  # Custom hooks (useQueries)
├── pages/                  # Page components
├── services/               # API service
├── styles/                 # Global styles
├── types/                  # TypeScript types
├── utils/                  # Helper functions
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```

## 🔧 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📖 Features

### Authentication
- Admin login with JWT tokens
- Secure token storage
- Auto token refresh
- Protected routes

### Dashboard
- Overview stats (clients, tasks, pending/completed)
- Recent tasks list
- Real-time statistics

### Client Management
- Create, read, update, delete clients
- Search and filter clients
- View client details
- Bulk delete

### Task Management
- Create, read, update, delete tasks
- Link tasks to clients
- Change task status
- Filter by status and client
- Priority levels
- Due date tracking

## 🎨 Design

- Clean, professional interface
- Light theme with soft orange accent
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Consistent spacing and typography

## 🔐 Security

- JWT-based authentication
- Secure token storage with HttpOnly cookies
- Input validation with Zod
- Protected API calls
- CORS enabled

## 📱 Responsive

- Fully responsive design
- Mobile-first approach
- Works on all device sizes

## 🚀 Build

```bash
npm run build
```

## 📝 License

MIT
