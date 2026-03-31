import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function RecommendedCarousel({ onTaskClick }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchRecommendedTasks();
  }, []);

  const fetchRecommendedTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/recommended-tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch recommended tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = document.getElementById('carousel-container');
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading recommended tasks...</div>;
  }

  return (
    <div className="relative">
      <div
        id="carousel-container"
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="shrink-0 w-72 bg-linear-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600 hover:border-purple-500 cursor-pointer transition transform hover:scale-105 shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white flex-1 pr-2">{task.title}</h3>
              {task.category && (
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full whitespace-nowrap">
                  {task.category}
                </span>
              )}
            </div>
            <p className="text-gray-300 text-sm mb-4">{task.description}</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition">
              Add to Tasks
            </button>
          </div>
        ))}
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition -ml-4 z-10"
      >
        ❮
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition -mr-4 z-10"
      >
        ❯
      </button>
    </div>
  );
}
