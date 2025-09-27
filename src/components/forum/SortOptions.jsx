import React from 'react';
import { TrendingUp, Clock, Heart, MessageSquare } from 'lucide-react';

const SortOptions = ({ sortBy, setSortBy }) => {
  const options = [
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'recent', label: 'Recent', icon: Clock },
    { key: 'upvotes', label: 'Most Loved', icon: Heart },
    { key: 'discussed', label: 'Most Discussed', icon: MessageSquare }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {options.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setSortBy(key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            sortBy === key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default SortOptions;
