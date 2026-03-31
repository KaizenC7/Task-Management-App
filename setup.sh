#!/bin/bash
# Quick Setup Script for Task Management App

echo "🚀 Starting Task Management App Setup..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
  echo "📝 Creating .env file..."
  cp server/.env.example server/.env
  echo "⚠️  Please update server/.env with your JWT_SECRET"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 To start the application, run in two separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "🌐 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API at: http://localhost:5000/api"
