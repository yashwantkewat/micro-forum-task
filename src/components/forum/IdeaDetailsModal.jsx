import React, { useState, useEffect } from 'react';
import { Heart, Eye, User, Send } from 'lucide-react';
import { useForumStore } from '../store/forumStore';
import { formatTimeAgo } from '../utills/formatTimeAgo';

const IdeaDetailsModal = ({ idea, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const { addComment, upvoteIdea, incrementViews, currentUser } = useForumStore();

  useEffect(() => {
    if (idea) incrementViews(idea.id);
  }, [idea, incrementViews]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(idea.id, {
        author: currentUser,
        content: newComment.trim()
      });
      setNewComment('');
    }
  };

  const isUpvoted = idea.upvotedBy.includes(currentUser);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{idea.author}</p>
                <p className="text-sm text-gray-500">{formatTimeAgo(idea.timestamp)}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">×</button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">{idea.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{idea.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => upvoteIdea(idea.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isUpvoted ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`} />
              {idea.upvotes} Upvotes
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-5 h-5" />
              {idea.views} Views
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Discussion ({idea.comments.length})
            </h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {idea.comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-gray-700 text-sm ml-8">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailsModal;
