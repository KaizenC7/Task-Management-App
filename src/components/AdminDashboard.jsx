import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

export default function AdminDashboard({ token }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    department: ''
  });
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    description: '',
    manager_id: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch {
      toast.error('Failed to fetch users');
    }
  }, [token]);

  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch {
      toast.error('Failed to fetch teams');
    }
  }, [token]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch {
      toast.error('Failed to fetch projects');
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'teams') fetchTeams();
    if (activeTab === 'projects') fetchProjects();
  }, [activeTab, fetchUsers, fetchTeams, fetchProjects]);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/admin/users`, newUserForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User created successfully');
      setNewUserForm({ username: '', email: '', password: '', role: 'user', department: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/teams`, newTeamForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Team created successfully');
      setNewTeamForm({ name: '', description: '', manager_id: '' });
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create team');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User role updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const deactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('User deactivated');
        fetchUsers();
      } catch {
        toast.error('Failed to deactivate user');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 font-semibold transition ${
            activeTab === 'users'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-6 py-2 font-semibold transition ${
            activeTab === 'teams'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Teams
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-2 font-semibold transition ${
            activeTab === 'projects'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Projects
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Create New User</h2>
            <form onSubmit={createUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  required
                />
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Department"
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white col-span-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Create User
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-750">
                    <td className="px-6 py-3">{u.username}</td>
                    <td className="px-6 py-3">{u.email}</td>
                    <td className="px-6 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">{u.department || '-'}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => deactivateUser(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div>
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Create New Team</h2>
            <form onSubmit={createTeam} className="space-y-4">
              <input
                type="text"
                placeholder="Team Name"
                value={newTeamForm.name}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                required
              />
              <textarea
                placeholder="Description"
                value={newTeamForm.description}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                rows="3"
              />
              <select
                value={newTeamForm.manager_id}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, manager_id: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="">Select Team Manager</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Create Team
              </button>
            </form>
          </div>

          {/* Teams List */}
          <div className="grid gap-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <p className="text-gray-400 text-sm">{team.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-bold text-white">{project.name}</h3>
                <p className="text-gray-400 text-sm">{project.description}</p>
                <p className="text-purple-400 text-xs mt-2">Status: {project.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
