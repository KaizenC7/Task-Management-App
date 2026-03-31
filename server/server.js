import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const db = new Database(path.join(__dirname, 'tasks.db'));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Initialize database
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      department TEXT,
      team_id INTEGER,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      manager_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      owner_id INTEGER NOT NULL,
      team_id INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_by INTEGER NOT NULL,
      assigned_to INTEGER,
      project_id INTEGER,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      completed BOOLEAN DEFAULT 0,
      scheduled_time TEXT,
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS task_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS recommended_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert sample recommended tasks if not exists
  const count = db.prepare('SELECT COUNT(*) as count FROM recommended_tasks').get().count;
  if (count === 0) {
    const sampleTasks = [
      { title: 'Morning Workout', description: 'Start your day with exercise', category: 'health' },
      { title: 'Review Daily Goals', description: 'Plan your day', category: 'productivity' },
      { title: 'Drink Water', description: 'Stay hydrated', category: 'health' },
      { title: 'Read for 30 minutes', description: 'Expand your knowledge', category: 'learning' },
      { title: 'Team Meeting Prep', description: 'Prepare for meetings', category: 'work' },
    ];

    const stmt = db.prepare('INSERT INTO recommended_tasks (title, description, category) VALUES (?, ?, ?)');
    sampleTasks.forEach(task => {
      stmt.run(task.title, task.description, task.category);
    });
  }
}

initializeDatabase();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware: Authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware: Check Role-Based Access Control
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API Server Running',
    version: '1.0.0',
    endpoints: '/api/auth/login, /api/tasks, /api/admin/users, /api/teams, /api/projects'
  });
});

// Auth Routes

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = bcryptjs.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  team_id: user.team_id
}, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing username, email, or password' });
  }

  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user with default role 'user'
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(username, email, hashedPassword, 'user');

    // Get the created user
    const user = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(result.lastInsertRowid);

    // Generate token
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      team_id: null
    }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Task Routes
app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, scheduled_time } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO tasks (created_by, title, description, scheduled_time) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, title, description || '', scheduled_time || null);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});


// Recommended Tasks Route
app.get('/api/recommended-tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM recommended_tasks ORDER BY RANDOM() LIMIT 10').all();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommended tasks' });
  }
});

// Admin Routes - User Management
app.get('/api/admin/users', authenticateToken, authorizeRole('admin'), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, username, email, role, department, team_id, is_active, created_at 
      FROM users
    `).all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/admin/users', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { username, email, password, role, department, team_id } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password, role, department, team_id) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(username, email, hashedPassword, role || 'user', department, team_id);
    
    const newUser = db.prepare('SELECT id, username, email, role, department, team_id FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/admin/users/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;
  const { role, department, team_id, is_active } = req.body;

  try {
    const stmt = db.prepare(
      'UPDATE users SET role = ?, department = ?, team_id = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(role, department, team_id, is_active, id);
    
    const user = db.prepare('SELECT id, username, email, role, department, team_id FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('UPDATE users SET is_active = 0 WHERE id = ?').run(id);
    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

// Teams Management
app.get('/api/teams', authenticateToken, (req, res) => {
  try {
    const teams = db.prepare('SELECT * FROM teams').all();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.post('/api/teams', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { name, description, manager_id } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO teams (name, description, manager_id) VALUES (?, ?, ?)');
    const result = stmt.run(name, description, manager_id);
    
    const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Projects Management
app.get('/api/projects', authenticateToken, (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT * FROM projects 
      WHERE owner_id = ? OR team_id IN (SELECT team_id FROM users WHERE id = ?)
    `).all(req.user.id, req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, description, team_id } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO projects (name, description, owner_id, team_id) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, description, req.user.id, team_id);
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Enhanced Task Routes with Assignment
app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, scheduled_time, assigned_to, project_id, priority, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO tasks (created_by, title, description, assigned_to, project_id, priority, due_date, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, title, description || '', assigned_to, project_id, priority || 'medium', due_date, scheduled_time);

    const task = db.prepare(`
      SELECT t.*, u.username as assigned_to_name, c.username as created_by_name, p.name as project_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.get('/api/tasks', authenticateToken, (req, res) => {
  const { search, assigned_to, project_id, status, priority, filter_type } = req.query;

  try {
    let query = `
      SELECT t.*, u.username as assigned_to_name, c.username as created_by_name, p.name as project_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    // Filter type: 'my' = created by user, 'assigned' = assigned to user, 'team' = team tasks
    if (filter_type === 'my') {
      query += ' AND t.created_by = ?';
      params.push(req.user.id);
    } else if (filter_type === 'assigned') {
      query += ' AND t.assigned_to = ?';
      params.push(req.user.id);
    } else if (filter_type === 'team') {
      query += ` AND (t.assigned_to = ? OR t.created_by IN (SELECT id FROM users WHERE team_id = ?))`;
      params.push(req.user.id, req.user.team_id);
    } else {
      // Default: show user's own and assigned tasks
      query += ' AND (t.created_by = ? OR t.assigned_to = ?)';
      params.push(req.user.id, req.user.id);
    }

    if (search) {
      query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (assigned_to) {
      query += ' AND t.assigned_to = ?';
      params.push(assigned_to);
    }

    if (project_id) {
      query += ' AND t.project_id = ?';
      params.push(project_id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY t.created_at DESC';
    const stmt = db.prepare(query);
    const tasks = stmt.all(...params);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, completed, scheduled_time, assigned_to, priority, status, due_date } = req.body;

  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is creator or admin
    if (task.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only task creator or admin can update' });
    }

    const stmt = db.prepare(
      'UPDATE tasks SET title = ?, description = ?, completed = ?, scheduled_time = ?, assigned_to = ?, priority = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(
      title || task.title,
      description !== undefined ? description : task.description,
      completed !== undefined ? completed : task.completed,
      scheduled_time || task.scheduled_time,
      assigned_to !== undefined ? assigned_to : task.assigned_to,
      priority || task.priority,
      status || task.status,
      due_date || task.due_date,
      id
    );

    const updatedTask = db.prepare(`
      SELECT t.*, u.username as assigned_to_name, c.username as created_by_name, p.name as project_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `).get(id);
    
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is creator or admin
    if (task.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only task creator or admin can delete' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Assign Task (Admin or Task Creator)
app.post('/api/tasks/:id/assign', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only task creator or admin can assign' });
    }

    db.prepare('UPDATE tasks SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(assigned_to, id);
    
    const updatedTask = db.prepare(`
      SELECT t.*, u.username as assigned_to_name, c.username as created_by_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = ?
    `).get(id);
    
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

// Recommended Tasks Route
app.get('/api/recommended-tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM recommended_tasks ORDER BY RANDOM() LIMIT 10').all();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommended tasks' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
