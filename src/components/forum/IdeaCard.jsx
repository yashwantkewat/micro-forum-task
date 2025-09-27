import React from 'react';
import { Heart, MessageSquare, Eye, User, Clock, TrendingUp } from 'lucide-react';
import { useForumStore } from '../store/forumStore';
import { formatTimeAgo } from '../utills/formatTimeAgo';

const IdeaCard = ({ idea, onExpand }) => {
  const { upvoteIdea, currentUser } = useForumStore();
  const isUpvoted = idea.upvotedBy.includes(currentUser);

  const discussionScore = idea.comments.length * 2 + idea.upvotes + Math.floor(idea.views / 5);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{idea.author}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(idea.timestamp)}
            </p>
          </div>
        </div>
        {discussionScore > 20 && (
          <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Hot Topic
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h3>
      <p className="text-gray-700 mb-4 line-clamp-3">{idea.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => upvoteIdea(idea.id)}
            aria-label={isUpvoted ? 'Remove upvote' : 'Upvote'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              isUpvoted ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
            {idea.upvotes}
          </button>

          <button
            onClick={() => onExpand(idea)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {idea.comments.length}
          </button>

          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            {idea.views}
          </div>
        </div>

        <button
          onClick={() => onExpand(idea)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
