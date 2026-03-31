import React, { useState } from 'react';
import TaskAssignmentModal from './TaskAssignmentModal';

export default function TaskList({ 
  tasks, 
  onDelete, 
  onToggleCompleted, 
  onEdit, 
  onUpdate, 
  editingTask,
  users = [],
  isAdmin = false,
  token = '',
  onTaskAssigned = null
}) {
  const [editState, setEditState] = useState({
    title: '',
    description: '',
    scheduledTime: ''
  });
  const [assigningTaskId, setAssigningTaskId] = useState(null);

  const getAssigneeName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unassigned';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-200';
      case 'in_progress': return 'bg-blue-900 text-blue-200';
      case 'review': return 'bg-purple-900 text-purple-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  const handleEdit = (task) => {
    onEdit(task);
    setEditState({
      title: task.title,
      description: task.description || '',
      scheduledTime: task.scheduled_time || ''
    });
  };

  const handleSave = (taskId) => {
    onUpdate(taskId, editState.title, editState.description, editState.scheduledTime);
  };

  const handleCancel = () => {
    onEdit(null);
    setEditState({
      title: '',
      description: '',
      scheduledTime: ''
    });
  };

  return (
    <div className="space-y-6">
      {assigningTaskId && (
        <TaskAssignmentModal
          task={tasks.find(t => t.id === assigningTaskId)}
          users={users}
          onAssign={onTaskAssigned || (() => {})}
          onClose={() => setAssigningTaskId(null)}
          token={token}
        />
      )}
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-slate-800 rounded-md p-4 lg:p-6 border-l-4 transition shadow-lg ${
            task.completed
              ? 'border-l-green-500 bg-slate-800 opacity-75'
              : 'border-l-purple-500 hover:border-l-blue-500 hover:shadow-xl'
          }`}
        >
          {editingTask?.id === task.id ? (
            // Edit Mode
            <div className="space-y-3 lg:space-y-4">
              <input
                type="text"
                value={editState.title}
                onChange={(e) => setEditState({ ...editState, title: e.target.value })}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
              />
              <textarea
                value={editState.description}
                onChange={(e) => setEditState({ ...editState, description: e.target.value })}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none resize-none"
                rows="2"
              />
              <input
                type="datetime-local"
                value={editState.scheduledTime}
                onChange={(e) => setEditState({ ...editState, scheduledTime: e.target.value })}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
              />
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => handleSave(task.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 lg:py-3 rounded-md font-semibold transition transform hover:scale-105"
                >
                  💾 Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 lg:py-3 rounded-md font-semibold transition"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="flex-1 cursor-pointer" onClick={() => onToggleCompleted(task.id, task.completed)}>
                <div className="flex items-start gap-3 lg:gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleCompleted(task.id, task.completed)}
                    className="w-5 lg:w-6 h-5 lg:h-6 cursor-pointer accent-purple-500 mt-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base lg:text-lg ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-xs lg:text-sm mt-2 ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {task.description}
                      </p>
                    )}
                    {task.scheduled_time && (
                      <p className="text-xs lg:text-sm text-purple-400 mt-2 lg:mt-3">
                        ⏰ {new Date(task.scheduled_time).toLocaleString()}
                      </p>
                    )}
                    {/* Task Metadata */}
                    <div className="flex flex-wrap gap-2 lg:gap-3 mt-3">
                      {task.assigned_to && (
                        <span className="inline-block text-xs bg-slate-700 text-gray-300 px-2 lg:px-3 py-1 rounded-md font-semibold">
                          👤 {getAssigneeName(task.assigned_to)}
                        </span>
                      )}
                      {task.priority && (
                        <span className={`inline-block text-xs font-semibold px-2 lg:px-3 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'low' ? '🟢' : task.priority === 'medium' ? '🟡' : '🔴'} {task.priority.toUpperCase()}
                        </span>
                      )}
                      {task.status && (
                        <span className={`inline-block text-xs font-semibold px-2 lg:px-3 py-1 rounded-md ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="inline-block text-xs bg-slate-700 text-gray-300 px-2 lg:px-3 py-1 rounded-md font-semibold">
                          📅 {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0 flex-wrap lg:flex-nowrap">
                {isAdmin && (
                  <button
                    onClick={() => setAssigningTaskId(task.id)}
                    className="flex-1 lg:flex-none bg-purple-600 hover:bg-purple-700 text-white px-2 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-semibold transition transform hover:scale-105"
                    title="Assign task to user"
                  >
                    Assign
                  </button>
                )}
                <button
                  onClick={() => handleEdit(task)}
                  className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-semibold transition transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 text-white px-2 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-semibold transition transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
