# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Start Backend (Terminal 1)

```bash
cd client-work-backend
npm install
npm run seed
npm run dev
```

**Expected output:**
```
Connected to MongoDB
Server running on port 5000
Admin seeded successfully
```

### 2. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 123 ms
➜  Local:   http://localhost:5173/
```

### 3. Open Browser

Go to: `http://localhost:5173`

### 4. Login

- **Email**: `admin@company.com`
- **Password**: `Admin@123456`

### ✅ Done!

You should see the dashboard with stats and recent tasks.

---

## 🧪 Test the Features

### Create a Client

1. Click "Clients" in sidebar
2. Click "Add Client"
3. Fill in details:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Company**: Acme Corp
4. Click "Save"
5. See client in table

### Create a Task

1. Click "Tasks" in sidebar
2. Click "Create Task"
3. Fill in details:
   - **Title**: Website Design
   - **Client**: John Doe
   - **Description**: Design homepage
   - **Status**: Pending
   - **Priority**: Medium
4. Click "Save"
5. See task in table

### Change Task Status

1. Go to Tasks
2. Click "•••" menu on a task
3. Select "Mark In Progress"
4. Watch status update

### Dashboard

Click home icon to see:
- Total clients count
- Total tasks count
- Pending tasks count
- Completed tasks count
- Recent tasks list

---

## 📁 Project Structure

```
client-work-backend/    ← Backend (Node.js)
frontend/               ← Frontend (React)
SETUP_GUIDE.md         ← Detailed setup
ARCHITECTURE.md        ← Architecture explanation
```

---

## 🔧 Common Issues

### Port 5000 Already in Use

```bash
# Change backend port
PORT=5001 npm run dev

# Update frontend .env.local
VITE_API_URL=http://localhost:5001/api
```

### Port 5173 Already in Use

```bash
# Vite will automatically use next available port
npm run dev
```

### "Cannot find module" Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### API Connection Error

Check:
1. Backend is running on port 5000
2. `.env.local` has correct API URL
3. No CORS errors in browser console

---

## 📊 Default Database

Uses MongoDB Atlas (cloud database)

To use local MongoDB:
1. Install MongoDB
2. Update `MONGODB_URI` in backend `.env`
3. Restart backend

---

## 🚢 Deployment

### Frontend

```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3
# - Any static host
```

### Backend

```bash
# Deploy to:
# - Heroku
# - Railway
# - AWS EC2
# - DigitalOcean
```

---

## 💡 Tips

- **Search**: Use search bars in Clients and Tasks to filter
- **Edit**: Click "•••" menu and select "Edit" to modify
- **Delete**: Click "•••" menu and select "Delete" (confirm)
- **Refresh**: Browser auto-syncs, no manual refresh needed
- **Logout**: Click avatar in top-right → Logout

---

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` for detailed setup
2. Check `ARCHITECTURE.md` for code structure
3. Check terminal for error messages
4. Check browser DevTools (F12) for API errors

---

**Happy building!** 🎉
