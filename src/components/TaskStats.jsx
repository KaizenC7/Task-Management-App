import React from 'react';

export default function TaskStats({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium' && !t.completed).length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low' && !t.completed).length;

  const overdueTasks = tasks.filter(t => {
    if (t.completed || !t.due_date) return false;
    return new Date(t.due_date) < new Date();
  }).length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-linear-to-br from-purple-900 to-blue-900 rounded-md p-6 border border-purple-700 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-4">📊 Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-semibold">Completion</span>
              <span className="text-purple-300 font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-linear-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Total Tasks */}
        <div className="bg-slate-800 rounded-md p-4 border border-slate-700 hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-white">{totalTasks}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-slate-800 rounded-md p-4 border border-slate-700 hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{pendingTasks}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-slate-800 rounded-md p-4 border border-slate-700 hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* High Priority */}
        {highPriorityTasks > 0 && (
          <div className="bg-slate-800 rounded-md p-4 border border-red-700 hover:border-red-600 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">High Priority</p>
                <p className="text-3xl font-bold text-red-400">{highPriorityTasks}</p>
              </div>
              <div className="text-4xl">🔴</div>
            </div>
          </div>
        )}

        {/* Overdue Tasks */}
        {overdueTasks > 0 && (
          <div className="bg-slate-800 rounded-md p-4 border border-orange-700 hover:border-orange-600 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-orange-400">{overdueTasks}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        )}
      </div>

      {/* Priority Breakdown */}
      <div className="bg-slate-800 rounded-md p-6 border border-slate-700">
        <h4 className="text-lg font-bold text-white mb-4">Priority Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              <span className="text-gray-300">High</span>
            </div>
            <span className="font-bold text-red-400">{highPriorityTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟡</span>
              <span className="text-gray-300">Medium</span>
            </div>
            <span className="font-bold text-yellow-400">{mediumPriorityTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              <span className="text-gray-300">Low</span>
            </div>
            <span className="font-bold text-green-400">{lowPriorityTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
