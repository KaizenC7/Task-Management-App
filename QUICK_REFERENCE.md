# Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
# Open PowerShell in project root
npm install
cd server && npm install && cd ..
```

### 2. Start Backend
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 3. Start Frontend (New Terminal)
```bash
npm run dev
# App runs on http://localhost:5173
```

### 4. Create Account
- Register with email and password
- OR use demo: demo@example.com / demo123

## 📁 File Structure Overview

| Path | Purpose |
|------|---------|
| `src/TaskManagementApp.jsx` | Main app component |
| `src/components/*.jsx` | React components |
| `src/services/` | API & notification services |
| `src/index.css` | Tailwind CSS styles |
| `server/server.js` | Express backend |
| `tailwind.config.js` | Tailwind configuration |

## 🎯 Key Features

### Authentication
- Register: POST `/api/auth/register`
- Login: POST `/api/auth/login`
- Token stored in localStorage

### Tasks
- **Add**: `onAddTask(title, description, scheduledTime)`
- **Edit**: `onUpdate(id, title, desc, time)`
- **Delete**: `onDelete(id)`
- **Search**: Filter by title/description
- **Complete**: Toggle completion status

### Notifications
- 5-minute before scheduled time
- At exact scheduled time
- Browser permission required

### Recommended Tasks
- Carousel with 10 random suggestions
- Click to add to your tasks
- Categories included

## 🔧 Common Tasks

### Add a New Component
```jsx
// Create src/components/MyComponent.jsx
export default function MyComponent() {
  return <div>Component content</div>;
}

// Import in TaskManagementApp.jsx
import MyComponent from './components/MyComponent';
```

### Add a New API Endpoint
```javascript
// In server/server.js
app.get('/api/new-endpoint', authenticateToken, (req, res) => {
  // Your handler
  res.json({ data: 'response' });
});
```

### Style Component with Tailwind
```jsx
<div className="bg-slate-800 p-4 rounded-lg text-white">
  {/* content */}
</div>
```

### Common Tailwind Classes
| Class | Purpose |
|-------|---------|
| `bg-*` | Background color |
| `text-*` | Text color |
| `p-*` | Padding |
| `m-*` | Margin |
| `rounded-*` | Border radius |
| `hover:*` | Hover states |
| `flex`, `grid` | Layout |
| `w-full` | Full width |
| `max-w-*` | Max width |

## 🐛 Debugging

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/tasks

# View server logs
npm run dev  # Use dev mode for better logs

# Check database
# Database file: server/tasks.db (SQLite)
```

### Frontend Issues
```javascript
// Open browser console (F12)
// Check network tab for API calls
// Verify token in localStorage:
console.log(localStorage.getItem('token'));
```

### Notification Issues
```javascript
// Check permission status
console.log(Notification.permission);

// Test notification
new Notification('Test', { body: 'Test notification' });
```

## 📦 Dependencies

### Frontend
- `react` - UI framework
- `axios` - HTTP client
- `react-hot-toast` - Toast notifications
- `tailwindcss` - CSS framework
- `react-multi-carousel` - Carousel component

### Backend
- `express` - Web framework
- `better-sqlite3` - Database
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Don't commit `.env` file
- [ ] Use environment variables
- [ ] Enable CORS only for trusted origins
- [ ] Hash passwords (auto-handled)
- [ ] Set token expiration
- [ ] Use secure session cookies

## 📊 Database Commands

### SQLite Access
```bash
# Install sqlite3 CLI if needed
# Then access database:
sqlite3 server/tasks.db

# Common commands in sqlite3:
.tables                    # Show tables
SELECT * FROM users;      # View users
SELECT * FROM tasks;      # View tasks
.quit                     # Exit
```

### Reset Database
```bash
# Delete existing database (recreates on startup)
rm server/tasks.db
# Or on Windows:
del server\tasks.db
```

## 🌐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
JWT_SECRET=your-super-secret-key
PORT=5000
NODE_ENV=development
```

## 📱 Testing Checklist

- [ ] Can register new account
- [ ] Can login with email/password
- [ ] Can add task with title
- [ ] Can add task with description
- [ ] Can set scheduled time
- [ ] Can edit existing task
- [ ] Can delete task
- [ ] Can mark task complete
- [ ] Can search tasks
- [ ] Can add from recommended tasks
- [ ] Notifications appear at scheduled time
- [ ] Can logout successfully

## 🚀 Deployment Steps

### Frontend
```bash
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

### Backend
```bash
# Create account on Heroku/Railway
# Set environment variables
# Deploy with git push or CLI
```

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [Express Guide](https://expressjs.com)
- [JWT Introduction](https://jwt.io)
- [SQLite Tutorial](https://www.sqlitetutorial.net)

## 💡 Pro Tips

1. **Search Debouncing**: Add debounce to search for performance
2. **Pagination**: Add pagination for large task lists
3. **Filters**: Add task status filters (completed/pending)
4. **Categories**: Organize tasks by categories
5. **Recurring Tasks**: Implement task recurrence
6. **Dark Mode**: Tailwind makes theme switching easy
7. **PWA**: Add service worker for offline support
8. **Analytics**: Track user behavior and usage

## 📞 Support

For issues:
1. Check browser console for errors
2. Check server logs
3. Verify environment variables
4. Check database is created
5. Ensure ports 5000 & 5173 are available

## 🎓 Learning Path

1. Start with authentication
2. Understand task CRUD
3. Learn search functionality
4. Explore notifications
5. Study security features
6. Deploy to production

---
Happy coding! 🎉
