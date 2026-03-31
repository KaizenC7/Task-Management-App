import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (username, email, password) =>
    apiClient.post('/auth/register', { username, email, password }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
};

export const taskService = {
  create: (title, description, scheduled_time) =>
    apiClient.post('/tasks', { title, description, scheduled_time }),
  
  getAll: (search = '') =>
    apiClient.get('/tasks', { params: { search } }),
  
  update: (id, title, description, completed, scheduled_time) =>
    apiClient.put(`/tasks/${id}`, { title, description, completed, scheduled_time }),
  
  delete: (id) =>
    apiClient.delete(`/tasks/${id}`),
};

export const recommendedService = {
  getRecommended: () =>
    apiClient.get('/recommended-tasks'),
};

export const adminService = {
  getAllUsers: () =>
    apiClient.get('/admin/users'),
};

export default apiClient;
