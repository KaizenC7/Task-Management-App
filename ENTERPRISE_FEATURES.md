# Enterprise Task Management Features

## Overview

Your task management app has been transformed into an **enterprise-grade corporate task management system** similar to Microsoft Planner. It now supports organizational teams, task assignment, and advanced filtering.

## New Features Implemented

### 1. **Admin Dashboard** 
- **User Management**: Create, update, and manage user accounts
- **Role Assignment**: Assign roles (User, Manager, Admin) to employees
- **Team Management**: Create and organize teams within the organization
- **Project Management**: Set up projects and assign them to teams
- **Department Tracking**: Track users by department for better organization

### 2. **Task Assignment System**
- **Admin Task Creation**: Admins can create tasks and assign them to specific users
- **Task Properties**: Each task now includes:
  - **Assigned To**: Which employee is responsible
  - **Priority**: Low, Medium, High, Urgent
  - **Status**: Pending, In Progress, Review, Completed
  - **Due Date**: Deadline tracking
  - **Project Association**: Link tasks to projects
  - **Created By**: Track who created the task

### 3. **Advanced Task Filtering**
Users can filter tasks by:
- **Filter Type**: All Tasks, My Created Tasks, Assigned To Me, Team Tasks
- **Assignee**: See tasks assigned to specific team members
- **Project**: Filter by project
- **Priority**: Filter by urgency level
- **Status**: Filter by current task status
- **Search**: Full-text search across task titles and descriptions

### 4. **Organizational Structure**
- **Users**: Employee accounts with roles and departments
- **Teams**: Group employees into teams with assigned managers
- **Projects**: Organize work into projects assigned to teams
- **Task Comments**: Support for task comments and discussions

## Architecture

### Database Schema
```
users
├─ id, username, email, password (hashed)
├─ role (user/manager/admin)
├─ department, team_id
└─ is_active, timestamps

teams
├─ id, name, description, manager_id
└─ created_at

projects
├─ id, name, description, owner_id, team_id
├─ status (pending/in_progress/completed)
└─ created_at

tasks
├─ id, title, description
├─ created_by, assigned_to (NEW)
├─ project_id, priority, status (NEW)
├─ due_date, scheduled_time (NEW)
├─ completed, timestamps

task_comments
├─ id, task_id, user_id, comment, created_at

recommended_tasks
├─ id, title, description, category, created_at
```

## API Endpoints

### Admin User Management
```
GET    /api/admin/users                - List all users
POST   /api/admin/users                - Create new user
PUT    /api/admin/users/:id            - Update user (role, department, team)
DELETE /api/admin/users/:id            - Deactivate user
```

### Team Management
```
GET    /api/teams                      - List teams
POST   /api/teams                      - Create team
```

### Project Management
```
GET    /api/projects                   - List projects
POST   /api/projects                   - Create project
```

### Task Management (Enhanced)
```
GET    /api/tasks                      - Get tasks with filters
     - filter_type: 'all'|'my'|'assigned'|'team'
     - assigned_to: userId
     - project_id: projectId
     - priority: 'low'|'medium'|'high'|'urgent'
     - status: 'pending'|'in_progress'|'review'|'completed'
     - search: searchTerm

POST   /api/tasks                      - Create task (now supports assigned_to, priority, etc.)
PUT    /api/tasks/:id                  - Update task (including assignment, priority, status)
DELETE /api/tasks/:id                  - Delete task
POST   /api/tasks/:id/assign           - Assign task to user
```

## Getting Started

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
The server runs on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
npm install
npm run dev
```
The app runs on `http://localhost:5173`

### 3. Create Admin Account
First, create an admin user through the registration form. Then use the database to promote that user to admin:

```bash
sqlite3 server/tasks.db
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

Or create an admin through the API (after promoting first user):
```bash
POST /api/admin/users
{
  "username": "admin",
  "email": "admin@company.com",
  "password": "secure_password",
  "role": "admin",
  "department": "Management"
}
```

### 4. Admin Dashboard Navigation
After logging in as admin, click the **⚙️ Admin Dashboard** tab to:
- Create new users
- Manage user roles and departments
- Create teams and assign managers
- View and manage projects

### 5. Assign Tasks
1. In the **Tasks** view, click **Assign** on any task
2. Select the employee to assign it to
3. Set priority, status, and due date
4. Click **Assign & Update**

### 6. Filter Tasks
Use the **Task Filter Bar** to:
- View only tasks assigned to you
- See all tasks created by you
- Filter by team, project, priority, or status
- Search for specific tasks

## Workflow Example

### Manager Onboarding a New Project
1. **Create Project** (Admin Dashboard → Projects)
   - Name: "Website Redesign"
   - Team: "Design Team"

2. **Create Users** (Admin Dashboard → Users)
   - Add team members with appropriate departments

3. **Create Tasks** (Main Tasks tab)
   - Create tasks related to the project
   - Assign each task to responsible team member
   - Set priority and due date

4. **Team Execution**
   - Team members see tasks assigned to them
   - They can update status and mark complete
   - Filter view shows their work queue

## Security Features

✅ **JWT Authentication**: 7-day token expiry
✅ **Password Hashing**: bcryptjs with 10-round salt
✅ **Role-Based Access Control**: Admin-only endpoints protected
✅ **CORS**: Configured for development and production
✅ **Token Validation**: Every protected endpoint verifies token

## Notifications

- Tasks include scheduled notifications
- 5-minute pre-task reminder
- On-time task start notification
- Browser push notifications (requires permission)

## Technology Stack

**Frontend:**
- React 19.1.0
- Tailwind CSS 4.1.18 (Vite plugin)
- Axios for HTTP
- React Hot Toast for notifications
- React Multi-Carousel for featured tasks

**Backend:**
- Express.js 4.18.2
- SQLite (better-sqlite3)
- JWT for authentication
- bcryptjs for password security

## Next Steps

1. ✅ Populate your organization with users
2. ✅ Set up teams and projects
3. ✅ Start assigning tasks to team members
4. ✅ Monitor progress and filter by status
5. ✅ Use the dashboard to manage users and departments

## Troubleshooting

**Admin Dashboard Not Showing?**
- Ensure you're logged in with an admin account
- Check the user's role in the database: `SELECT username, role FROM users;`

**Tasks Not Filtering?**
- Clear browser cache and localStorage
- Ensure backend server is running and accessible
- Check network tab in developer tools for API errors

**Notifications Not Working?**
- Grant browser notification permission when prompted
- Check that notification.permission is 'granted'
- Ensure notifications are enabled in browser settings

## Support

For issues or questions about the enterprise features, check:
1. Backend logs in terminal
2. Browser developer console (F12)
3. Network tab for API responses
4. Database: `sqlite3 server/tasks.db`
