import React from 'react';

export default function SearchBar({ onSearch }) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="relative w-full">
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="
            w-full
            px-4 lg:px-5 pr-10 lg:pr-12
            py-2 lg:py-3
            bg-slate-800
            border border-slate-700
            rounded-md
            text-sm lg:text-base
            text-white
            placeholder-gray-400
            focus:border-purple-500
            focus:ring-1 focus:ring-purple-500
            focus:outline-none
            transition
          "
        />
        <svg
          className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
