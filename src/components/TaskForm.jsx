import React, { useState } from 'react';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title, description, scheduledTime, priority);
      setTitle('');
      setDescription('');
      setScheduledTime('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-md p-4 lg:p-8 mb-8 lg:mb-12 shadow-lg w-full"
    >
      <div className="space-y-6 lg:space-y-7">
        {/* Title */}
        <div>
          <label className="block text-gray-300 text-xs lg:text-sm font-semibold mb-2">
            Task Title <span className="text-purple-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="
              w-full px-4 py-3
              bg-slate-700
              border border-slate-600
              rounded-md
              text-white
              placeholder-gray-400
              focus:border-purple-500
              focus:ring-1 focus:ring-purple-500
              focus:outline-none
              transition
            "
            required
          />
        </div>

        {/* Expanded section */}
        {isExpanded && (
          <div className="space-y-5 lg:space-y-6">
            <div>
              <label className="block text-gray-300 text-xs lg:text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about the task..."
                rows={3}
                className="
                  w-full px-4 py-3
                  bg-slate-700
                  border border-slate-600
                  rounded-md
                  text-white
                  placeholder-gray-400
                  focus:border-purple-500
                  focus:ring-1 focus:ring-purple-500
                  focus:outline-none
                  resize-none
                  transition
                "
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              <div>
                <label className="block text-gray-300 text-xs lg:text-sm font-semibold mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="
                    w-full px-3 py-3
                    bg-slate-700
                    border border-slate-600
                    rounded-md
                    text-white
                    focus:border-purple-500
                    focus:ring-1 focus:ring-purple-500
                    focus:outline-none
                    transition
                  "
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-xs lg:text-sm font-semibold mb-2">
                  Scheduled Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="
                    w-full px-3 py-3
                    bg-slate-700
                    border border-slate-600
                    rounded-md
                    text-white
                    focus:border-purple-500
                    focus:ring-1 focus:ring-purple-500
                    focus:outline-none
                    transition
                  "
                />
              </div>
            </div>

            <p className="text-gray-400 text-xs">
              ⏰ You’ll get notified at the scheduled time
            </p>
          </div>
        )}

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-400 hover:text-purple-300 text-xs lg:text-sm font-medium transition"
        >
          {isExpanded ? '↑ Fewer options' : '↓ More options'}
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="
            w-full px-4 py-3
            bg-purple-600 hover:bg-purple-700
            text-white
            font-semibold
            rounded-md
            transition
            transform hover:scale-105
          "
        >
          ➕ Add Task
        </button>
      </div>
    </form>
  );
}