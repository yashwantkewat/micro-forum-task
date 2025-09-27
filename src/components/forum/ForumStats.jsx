import React from 'react';

const ForumStats = ({ ideas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-blue-600">{ideas.length}</div>
        <div className="text-sm text-gray-600">Total Ideas</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-green-600">
          {ideas.reduce((sum, idea) => sum + idea.upvotes, 0)}
        </div>
        <div className="text-sm text-gray-600">Total Upvotes</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-purple-600">
          {ideas.reduce((sum, idea) => sum + idea.comments.length, 0)}
        </div>
        <div className="text-sm text-gray-600">Comments</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-orange-600">
          {ideas.filter(idea => 
            idea.comments.length * 2 + idea.upvotes + Math.floor(idea.views / 5) > 20
          ).length}
        </div>
        <div className="text-sm text-gray-600">Hot Topics</div>
      </div>
    </div>
  );
};

export default ForumStats;
