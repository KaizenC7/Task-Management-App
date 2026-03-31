@echo off
REM Quick Setup Script for Task Management App (Windows)

echo 🚀 Starting Task Management App Setup...

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
cd ..

REM Create .env file if it doesn't exist
if not exist server\.env (
  echo 📝 Creating .env file...
  copy server\.env.example server\.env
  echo ⚠️  Please update server/.env with your JWT_SECRET
)

echo.
echo ✅ Setup complete!
echo.
echo 📋 To start the application, run in two separate terminals:
echo.
echo Terminal 1 (Backend):
echo   cd server ^&^& npm start
echo.
echo Terminal 2 (Frontend):
echo   npm run dev
echo.
echo 🌐 Frontend will be available at: http://localhost:5173
echo 🔧 Backend API at: http://localhost:5000/api
pause
