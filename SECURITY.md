# Security & RBAC Implementation

## Authentication System

### JWT (JSON Web Tokens)
- Tokens are issued upon login/registration
- Stored securely in browser localStorage
- Automatically appended to all API requests
- Token expiration: 7 days (configurable in .env)

### Password Security
- Passwords are hashed using **bcryptjs** (10 salt rounds)
- Never stored in plain text
- Validated on every login

### Token Refresh Flow
```
User Login → JWT Generated → Stored in localStorage
→ Attached to each request header
→ Validated on server (middleware)
→ Rejected if expired → User logged out
```

## Role-Based Access Control (RBAC)

### User Roles
1. **User** (default)
   - Create their own tasks
   - View/Edit/Delete their tasks
   - Access search functionality
   - View recommended tasks

2. **Admin** (can be set in database)
   - Access to `/api/admin/users` endpoint
   - View all users in the system
   - Future: Full user management capabilities

### Permission Middleware
```javascript
// Example: Admin-only endpoint
app.get('/api/admin/users', authenticateToken, authorizeRole('admin'), handler)
```

## Security Best Practices

✅ **Implemented**
- Password hashing with bcryptjs
- JWT-based stateless authentication
- CORS enabled only for frontend origin
- Authorization middleware on protected routes
- Input validation on server
- Error messages don't leak sensitive info

🔐 **Additional Recommendations**
- Enable HTTPS in production
- Use environment variables for secrets (never commit .env)
- Implement rate limiting
- Add CSRF protection
- Use secure HTTP headers (Helmet.js)
- Implement token refresh mechanism
- Add 2FA for admin accounts
- Log security events

## Implementing 2FA (Two-Factor Authentication)

For enhanced security, implement 2FA:

1. Install: `npm install speakeasy qrcode`
2. Generate QR code on registration
3. Verify code on login
4. Backup codes for account recovery

## Data Privacy

- User passwords are never logged
- Session tokens have expiration
- Tasks are user-specific (isolated)
- Recommended tasks are public (no personal data)

## Development vs Production

### Development (.env)
```
JWT_SECRET=dev-secret-key
PORT=5000
NODE_ENV=development
```

### Production (.env.production)
```
JWT_SECRET=very-long-random-secret-key-generate-with-crypto
PORT=5000
NODE_ENV=production
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Testing Security

1. **Test unauthorized access**
   - Try accessing `/api/tasks` without token
   - Expected: 401 Unauthorized

2. **Test invalid token**
   - Modify token in browser console
   - Expected: 403 Forbidden

3. **Test role-based access**
   - Access `/api/admin/users` as regular user
   - Expected: 403 Insufficient permissions

## CORS Configuration

Currently configured to allow:
- Frontend: `http://localhost:5173` (development)
- Production: Update to your domain

```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

## Database Security

SQLite with better-sqlite3:
- No network exposure (local file)
- SQL injection prevented via parameterized queries
- Files stored securely outside public directory

For production, consider:
- PostgreSQL with encrypted connections
- Cloud databases with encryption at rest
- Regular backups
- Database access controls
