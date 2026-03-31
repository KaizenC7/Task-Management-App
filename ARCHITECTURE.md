# Architecture & Design

## Frontend Architecture

### Component Hierarchy
```
App
└── TaskManagementApp (Main Container)
    ├── AuthModal (if not authenticated)
    ├── Header (User info, Logout)
    ├── SearchBar
    ├── TaskForm (Add new tasks)
    ├── RecommendedCarousel
    └── TaskList
        └── TaskItem (Edit/Delete/Complete)
```

### State Management
- **React Hooks**: useState for local state
- **localStorage**: Persist auth token and user info
- **API State**: Managed per component for separation of concerns

### Data Flow
```
User Input → Component → API Call → Server
         ↓
    Response → Update State → Re-render
```

## Backend Architecture

### Layers
```
Express Server
    ↓
Routes Layer (/api/tasks, /api/auth, etc.)
    ↓
Middleware Layer (Auth, Authorization, Validation)
    ↓
Database Layer (SQLite with better-sqlite3)
```

### Request Flow
```
1. Request comes in
2. CORS Middleware → Logging
3. Auth Middleware (if protected route)
4. Authorization Middleware (if role-based)
5. Route Handler
6. Database Operation
7. Response sent back
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,          -- bcrypt hashed
  role TEXT DEFAULT 'user',         -- 'user' or 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  scheduled_time TEXT,              -- ISO 8601 format
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Recommended Tasks Table
```sql
CREATE TABLE recommended_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Contract

### Request/Response Format
```javascript
// Request
{
  headers: {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
  },
  body: { /* payload */ }
}

// Response (Success)
{
  status: 200,
  data: { /* response data */ }
}

// Response (Error)
{
  status: 4xx/5xx,
  error: "Error message"
}
```

## Authentication Flow

```
1. User registers → Password hashed → User stored in DB
2. User logs in → Email looked up → Password verified
3. JWT generated → Token sent to frontend
4. Frontend stores token in localStorage
5. Every API request includes token in Authorization header
6. Server verifies token → Extracts user info → Processes request
7. Expired token → User logged out → Redirect to login
```

## Security Layers

```
Frontend
  ↓
HTTPS/TLS (in production)
  ↓
Backend
  ├─ CORS validation
  ├─ Token verification
  ├─ Role authorization
  ├─ Input validation
  └─ Rate limiting (optional)
  ↓
Database (Encrypted at rest in production)
```

## Scalability Considerations

### Current Architecture
- Single Node.js server
- SQLite local database
- In-memory notification checking

### For Production Scale
- Load balancing (multiple Node instances)
- Redis for session/cache
- PostgreSQL or cloud database
- Message queue for notifications (Bull, RabbitMQ)
- Separate notification service

## Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading of components
- Debounced search (recommended)
- CSS-in-JS with Tailwind

### Backend
- Database indexes on frequently queried fields
- Connection pooling
- Query optimization
- Response compression (gzip)

## Error Handling

### Frontend
```javascript
try {
  // API call
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle generic error
  }
}
```

### Backend
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message
  });
});
```

## Deployment Considerations

### Frontend
- Build: `npm run build` → Creates optimized bundle
- Host on: Vercel, Netlify, GitHub Pages
- Environment: Production URL in .env.production

### Backend
- Run: Node.js hosting (Heroku, Railway, AWS, GCP)
- Database: Migrate to cloud DB (PostgreSQL, MongoDB)
- Environment: Secure .env variables
- SSL: Required for production

### Docker Setup (Optional)
```dockerfile
# Frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173

# Backend
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server ./
EXPOSE 5000
```

## Testing Strategy

### Unit Tests
- Component rendering
- API service functions
- Utility functions

### Integration Tests
- Full auth flow
- Task CRUD operations
- Search functionality

### E2E Tests
- Complete user journey
- Notification triggers
- Error scenarios

## Monitoring & Logging

### Recommended Tools
- **Frontend**: Sentry for error tracking
- **Backend**: Winston/Bunyan for logging
- **Database**: Query logs and slow query alerts
- **Performance**: NewRelic or DataDog

## Future Architecture Improvements

1. **Microservices**: Split into separate services
2. **Event-Driven**: Use message queues
3. **GraphQL**: Replace REST API
4. **Real-time**: WebSocket for live updates
5. **Caching**: Redis for frequently accessed data
6. **CDN**: Distribute static assets globally
