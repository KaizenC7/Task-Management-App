import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBar from './components/SearchBar';
import RecommendedCarousel from './components/RecommendedCarousel';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import TaskFilterBar from './components/TaskFilterBar';
import TaskStats from './components/TaskStats';
import NotificationService from './services/NotificationService';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TaskManagementApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeView, setActiveView] = useState('tasks'); // 'tasks', 'admin'
  const [filters, setFilters] = useState({
    filter_type: 'all',
    assigned_to: '',
    project_id: '',
    priority: '',
    status: '',
    search: ''
  });

  const token = localStorage.getItem('token');

  const initializeNotifications = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      NotificationService.start(tasks, token);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          NotificationService.start(tasks, token);
        }
      });
    }
  }, [tasks, token]);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setTasks(response.data);
      NotificationService.updateTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [token, filters]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch {
      console.error('Failed to fetch users');
    }
  }, [token]);

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch {
      console.error('Failed to fetch projects');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Only fetch users and projects if user is admin
        if (parsedUser.role === 'admin') {
          fetchUsers();
          fetchProjects();
        }
        initializeNotifications();
      }
    } else {
      setShowAuthModal(true);
    }
  }, [token, fetchUsers, fetchProjects, initializeNotifications]);

  useEffect(() => {
    if (token && isAuthenticated) {
      fetchTasks();
    }
  }, [filters, token, isAuthenticated]);

  const addTask = async (title, description, scheduled_time, priority = 'medium') => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tasks`,
        { title, description, scheduled_time, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTasks = [response.data, ...tasks];
      setTasks(updatedTasks);
      NotificationService.updateTasks(updatedTasks);
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    }
  };

  const toggleCompleted = async (id, completed) => {
    if (!token) return;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task.id === id ? response.data : task));
      toast.success(!completed ? 'Task completed' : 'Task marked incomplete');
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const updateTask = async (id, title, description, scheduled_time) => {
    if (!token) return;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        { title, description, scheduled_time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task.id === id ? response.data : task));
      setEditingTask(null);
      toast.success('Task updated');
      initializeNotifications();
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleRecommendedTaskClick = (recommendedTask) => {
    addTask(recommendedTask.title, recommendedTask.description || '');
    toast.success(`Added "${recommendedTask.title}" to your tasks`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
    setShowAuthModal(true);
    NotificationService.stop();
    toast.success('Logged out successfully');
  };

  const handleAuthSuccess = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    fetchTasks();
    fetchUsers();
    fetchProjects();
    initializeNotifications();
    toast.success('Successfully logged in');
  };

  const handleTaskRefresh = () => {
    fetchTasks();
  };

  if (showAuthModal && !isAuthenticated) {
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Task Management</h1>
            <p className="text-purple-100 mt-1">Organize your work efficiently</p>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-lg font-semibold">{user.username}</p>
              <p className="text-purple-100 text-sm mb-2">
                {user.role === 'admin' ? '👑 Administrator' : 'User'}
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      {user && user.role === 'admin' && (
        <div className="border-b border-slate-700 bg-slate-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex gap-4 p-4">
            <button
              onClick={() => setActiveView('tasks')}
              className={`px-6 py-2 font-semibold transition ${
                activeView === 'tasks'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 Tasks
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`px-6 py-2 font-semibold transition ${
                activeView === 'admin'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚙️ Admin Dashboard
            </button>
          </div>
        </div>
      )}

      {activeView === 'admin' && user?.role === 'admin' ? (
        <AdminDashboard user={user} token={token} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-8 max-w-full">
          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            {/* Search Bar and Filters Section */}
            <div className="mb-6 lg:mb-8">
              <SearchBar onSearch={(query) => setFilters({ ...filters, search: query })} />
              <TaskFilterBar
                onFilterChange={setFilters}
                users={users}
                projects={projects}
                token={token}
              />
            </div>

            {/* Add Task Form */}
            <TaskForm onAddTask={addTask} />

            {/* Recommended Tasks Carousel */}
            <div className="my-8 lg:my-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6">✨ Recommended Tasks</h2>
              <RecommendedCarousel onTaskClick={handleRecommendedTaskClick} />
            </div>

            {/* Task List */}
            <div className="my-8 lg:my-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  📋 Your Tasks {tasks.length > 0 && <span className="text-purple-400 text-xl lg:text-2xl">({tasks.length})</span>}
                </h2>
                <button
                  onClick={handleTaskRefresh}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-md font-semibold transition transform hover:scale-105"
                >
                  🔄 Refresh
                </button>
              </div>
              {isLoading ? (
                <div className="text-center text-white py-8 lg:py-12">
                  <p className="text-lg">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="bg-slate-800 rounded-md p-6 lg:p-12 text-center border border-slate-700">
                  <p className="text-gray-400 text-base lg:text-lg">No tasks yet. Add one to get started! 🚀</p>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggleCompleted={toggleCompleted}
                  onEdit={setEditingTask}
                  onUpdate={updateTask}
                  editingTask={editingTask}
                  users={users}
                  isAdmin={user?.role === 'admin'}
                  token={token}
                  onTaskAssigned={handleTaskRefresh}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, visible on lg screens */}
          <div className="hidden lg:block w-80 shrink-0 sticky top-8 max-h-[calc(100vh-100px)] overflow-y-auto">
            <TaskStats tasks={tasks} />
          </div>

          {/* Mobile Stats - Visible only on mobile */}
          <div className="lg:hidden w-full">
            <TaskStats tasks={tasks} />
          </div>
        </div>
      )}
    </div>
  );
}
