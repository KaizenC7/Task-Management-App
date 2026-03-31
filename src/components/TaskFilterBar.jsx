import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TaskFilterBar({ onFilterChange, users, }) {
  const [filterType, setFilterType] = useState('all');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      filter_type: filterType,
      assigned_to: assignedTo,
      priority,
      status,
    });
  };

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleFilterChange();
    }, 300);
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, assignedTo, priority, status]);

  return (
    <div className="bg-slate-800 rounded-md p-4 lg:p-6 border border-slate-700 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">

        {/* Filter Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white text-sm lg:text-base focus:border-purple-500 focus:outline-none w-full transition"
        >
          <option value="all">All Tasks</option>
          <option value="my">My Created Tasks</option>
          <option value="assigned">Assigned To Me</option>
          <option value="team">Team Tasks</option>
        </select>

        {/* Assigned To */}
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white text-sm lg:text-base focus:border-purple-500 focus:outline-none w-full transition"
        >
          <option value="">All Assignees</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white text-sm lg:text-base focus:border-purple-500 focus:outline-none w-full transition"
        >
          <option value="">All Priorities</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
          <option value="urgent">⚠️ Urgent</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white text-sm lg:text-base focus:border-purple-500 focus:outline-none w-full transition"
        >
          <option value="">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="in_progress">🔄 In Progress</option>
          <option value="review">👀 Review</option>
          <option value="completed">✅ Completed</option>
        </select>
      </div>
    </div>
  );
}
