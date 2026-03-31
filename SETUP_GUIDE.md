# Task Management App - Full Stack Implementation

A modern, full-stack task management application with authentication, real-time notifications, search functionality, and role-based access control.

## Features

✨ **Core Features**
- User authentication with JWT
- Create, read, update, delete tasks (CRUD)
- Mark tasks as complete/incomplete
- Search tasks by title or description
- Tailwind CSS beautiful UI

🎯 **Advanced Features**
- **Recommended Tasks Carousel**: Discover and add recommended tasks with one click
- **Push Notifications**: Get notifications 5 minutes before and at the exact time of scheduled tasks
- **Role-Based Access Control (RBAC)**: Admin and user roles with permission levels
- **Time-Based Task Scheduling**: Schedule tasks and receive reminders
- **Responsive Design**: Works seamlessly on desktop and mobile

## Project Structure

```
task-management-app/
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx          # Authentication (login/register)
│   │   ├── TaskForm.jsx           # Add new tasks
│   │   ├── TaskList.jsx           # Display and manage tasks
│   │   ├── SearchBar.jsx          # Search functionality
│   │   └── RecommendedCarousel.jsx# Recommended tasks carousel
│   ├── services/
│   │   └── NotificationService.js # Push notification logic
│   ├── TaskManagementApp.jsx      # Main app component
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind CSS styles
├── server/
│   ├── server.js                  # Express backend
│   ├── package.json               # Backend dependencies
│   └── .env.example               # Environment variables
├── package.json                   # Frontend dependencies
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── vite.config.js                 # Vite configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step 1: Install Frontend Dependencies

```bash
cd d:\React-Projects\task-management-app
npm install
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` and update values (JWT_SECRET is important for production):

```
JWT_SECRET=your-super-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\React-Projects\task-management-app
npm run dev
```

The application will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: (same as register)
```

### Task Endpoints (Requires Authentication)

All endpoints require `Authorization: Bearer <token>` header

#### Create Task
```
POST /api/tasks
{
  "title": "Meeting at 5",
  "description": "Team sync meeting",
  "scheduled_time": "2024-01-23T17:00:00"
}
```

#### Get All Tasks
```
GET /api/tasks
GET /api/tasks?search=meeting
```

#### Update Task
```
PUT /api/tasks/:id
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": false,
  "scheduled_time": "2024-01-23T17:00:00"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
```

### Recommended Tasks
```
GET /api/recommended-tasks
```

### Admin Endpoints

#### Get All Users (Admin only)
```
GET /api/admin/users
```

## Security Features

🔒 **Implemented Security**
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **RBAC**: Role-based access control (admin/user)
- **Authorization Middleware**: Endpoint protection with permission checks
- **CORS**: Cross-origin resource sharing configured
- **Input Validation**: Server-side validation for all inputs

## Push Notifications

The app includes automatic push notifications:
- **5-minute reminder**: Notifies before task time
- **On-time notification**: Alerts when task time arrives
- Requires browser permission (requested on first use)
- Works with scheduled tasks only

To enable notifications:
1. Grant permission when prompted
2. Ensure browser supports Notifications API
3. Keep the app or browser tab open

## Database

The backend uses SQLite with the following tables:
- **users**: Stores user accounts with hashed passwords
- **tasks**: User tasks with timestamps and completion status
- **recommended_tasks**: Predefined recommended tasks

## Tailwind CSS

The entire UI is built with Tailwind CSS for:
- Modern, responsive design
- Easy customization
- Consistent styling
- Better performance

## Demo Credentials

For testing (create your own for security):
- Email: `demo@example.com`
- Password: `demo123`

## Development

### Add New Dependencies
```bash
# Frontend
npm install package-name

# Backend
cd server && npm install package-name
```

### Build for Production
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

## Troubleshooting

**Backend connection error:**
- Ensure backend is running on port 5000
- Check `.env` configuration
- Verify CORS settings in server.js

**Notifications not working:**
- Grant browser notification permission
- Check if browser supports Notifications API
- Ensure tasks have scheduled times

**Tasks not saving:**
- Check browser console for errors
- Verify authentication token
- Ensure backend is responding

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project!

## Future Enhancements

- [ ] Google Calendar integration
- [ ] Task categories and tags
- [ ] Recurring tasks
- [ ] Task comments and collaboration
- [ ] Dark/Light theme toggle
- [ ] Mobile app version
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)
- [ ] Task analytics and statistics
