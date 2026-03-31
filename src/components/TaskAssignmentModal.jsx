import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TaskAssignmentModal({ task, users, onAssign, onClose, token }) {
  const [selectedUser, setSelectedUser] = useState(task?.assigned_to || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'pending');
  const [dueDate, setDueDate] = useState(task?.due_date || '');

  const handleAssign = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/tasks/${task.id}`,
        {
          assigned_to: selectedUser || task.assigned_to,
          priority,
          status,
          due_date: dueDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Task updated successfully');
      onAssign();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 w-full max-w-md p-8 rounded-md border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Assign Task</h2>

        <div className="space-y-5">
          {[
            { label: 'Assign To', value: selectedUser, setter: setSelectedUser, options: users.map(u => ({ id: u.id, label: u.username })) },
          ].map(() => null)}

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Assign To</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full h-11 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-11 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-11 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAssign}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-md font-semibold transition"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white h-11 rounded-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
