# How to Start the E-Learning Platform

## Prerequisites
1. **MongoDB must be running** on `localhost:27017`
2. **Node.js** must be installed

## Starting the Backend Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. You should see:
   ```
   MongoDB connected
   Server running on port 5000
   ```

## Starting the Frontend

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

4. The app should open automatically at `http://localhost:3000`

## Troubleshooting

### If you see "Network Error":
1. Make sure the backend server is running (check terminal for "Server running on port 5000")
2. Make sure MongoDB is running
3. Check that no other process is using port 5000

### If MongoDB connection fails:
- Make sure MongoDB is installed and running
- Default connection: `mongodb://localhost:27017/e_learning_platform`
- You can create a `.env` file in the `backend` directory with:
  ```
  MONGO_URI=mongodb://localhost:27017/e_learning_platform
  PORT=5000
  JWT_SECRET=your_secret_key_here
  ```

### If port 5000 is already in use:
- Change the PORT in `backend/server.js` or create a `.env` file with a different port
- Update `frontend/src/services/api.js` to match the new port

## Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd backend && npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm start
```

