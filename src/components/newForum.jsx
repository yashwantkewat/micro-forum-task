import React, { useState, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { MessageSquare, Heart, TrendingUp, Plus, Send, User, Clock, Eye } from 'lucide-react';

// Zustand store for state management
const useForumStore = create((set, get) => ({
  ideas: [
    {
      id: 1,
      title: "Implement AI-powered code reviews",
      content: "We should integrate AI tools to automatically review pull requests and suggest improvements, reducing manual review time.",
      author: "Sarah Chen",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      upvotes: 15,
      comments: [
        { id: 1, author: "Mike Johnson", content: "Great idea! Which AI tools are you thinking about?", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
        { id: 2, author: "Lisa Wong", content: "We tried CodeGuru at my previous company. Works well for Python and Java.", timestamp: new Date(Date.now() - 30 * 60 * 1000) }
      ],
      views: 43,
      upvotedBy: []
    },
    {
      id: 2,
      title: "Flexible work from anywhere policy",
      content: "Allow employees to work from any location for up to 3 months per year to improve work-life balance and attract global talent.",
      author: "David Park",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      upvotes: 28,
      comments: [
        { id: 1, author: "Emma Wilson", content: "This would be amazing for digital nomads!", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { id: 2, author: "Tom Bradley", content: "How would we handle time zone coordination?", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { id: 3, author: "Nina Patel", content: "We should consider tax implications for different countries.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) }
      ],
      views: 67,
      upvotedBy: []
    },
    {
      id: 3,
      title: "Weekly innovation hours",
      content: "Dedicate 4 hours every Friday for employees to work on personal projects or explore new technologies that could benefit the company.",
      author: "Alex Rivera",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      upvotes: 12,
      comments: [
        { id: 1, author: "Sophie Turner", content: "Similar to Google's 20% time? I love it!", timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000) }
      ],
      views: 29,
      upvotedBy: []
    }
  ],
  currentUser: "John Doe",

  // Add idea with safe id generation (handles empty array)
  addIdea: (idea) => set((state) => {
    const maxId = state.ideas.length ? Math.max(...state.ideas.map(i => i.id)) : 0;
    return {
      ideas: [{
        id: maxId + 1,
        ...idea,
        timestamp: new Date(),
        upvotes: 0,
        comments: [],
        views: 0,
        upvotedBy: []
      }, ...state.ideas]
    };
  }),

  upvoteIdea: (ideaId) => set((state) => {
    const currentUser = state.currentUser;
    return {
      ideas: state.ideas.map(idea => {
        if (idea.id === ideaId) {
          const hasUpvoted = idea.upvotedBy.includes(currentUser);
          return {
            ...idea,
            upvotes: hasUpvoted ? Math.max(0, idea.upvotes - 1) : idea.upvotes + 1,
            upvotedBy: hasUpvoted 
              ? idea.upvotedBy.filter(user => user !== currentUser)
              : [...idea.upvotedBy, currentUser]
          };
        }
        return idea;
      })
    };
  }),

  addComment: (ideaId, comment) => set((state) => ({
    ideas: state.ideas.map(idea => 
      idea.id === ideaId 
        ? {
            ...idea,
            comments: [
              ...idea.comments,
              {
                // safe id generation for comments
                id: Math.max(...idea.comments.map(c => c.id), 0) + 1,
                ...comment,
                timestamp: new Date()
              }
            ]
          }
        : idea
    )
  })),

  incrementViews: (ideaId) => set((state) => ({
    ideas: state.ideas.map(idea => 
      idea.id === ideaId ? { ...idea, views: idea.views + 1 } : idea
    )
  }))
}));

// Utility function to format time
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// New Idea Form Component
const NewIdeaForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addIdea, currentUser } = useForumStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addIdea({
        title: title.trim(),
        content: content.trim(),
        author: currentUser
      });
      setTitle('');
      setContent('');
      if (typeof onClose === 'function') onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Idea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idea Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's your big idea?"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your idea in detail..."
              maxLength={500}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
              Post Idea
            </button>
            <button
              type="button"
              onClick={() => typeof onClose === 'function' && onClose()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Idea Card Component
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
              isUpvoted 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

// Idea Details Modal
const IdeaDetailsModal = ({ idea, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const { addComment, upvoteIdea, incrementViews, currentUser } = useForumStore();

  useEffect(() => {
    if (idea) {
      incrementViews(idea.id);
    }
    // Only increment when idea changes (we keep incrementViews in closure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea]);

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

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">{idea.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{idea.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => upvoteIdea(idea.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isUpvoted 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

// Main Forum Component
const MicroForum = () => {
  const { ideas } = useForumStore();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [sortBy, setSortBy] = useState('trending');

  // Sort ideas based on selected criteria
  const sortedIdeas = useMemo(() => {
    const ideaList = [...ideas];

    switch (sortBy) {
      case 'trending':
        return ideaList.sort((a, b) => {
          const scoreA = a.comments.length * 2 + a.upvotes + Math.floor(a.views / 5);
          const scoreB = b.comments.length * 2 + b.upvotes + Math.floor(b.views / 5);
          return scoreB - scoreA;
        });
      case 'recent':
        return ideaList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'upvotes':
        return ideaList.sort((a, b) => b.upvotes - a.upvotes);
      case 'discussed':
        return ideaList.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return ideaList;
    }
  }, [ideas, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Ideas Forum</h1>
              <p className="text-gray-600 mt-1">Share ideas, get feedback, and drive innovation together</p>
            </div>
            <button
              onClick={() => setShowNewIdeaForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Idea
            </button>
          </div>

          {/* Stats */}
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

          {/* Sort Options */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'trending', label: 'Trending', icon: TrendingUp },
              { key: 'recent', label: 'Recent', icon: Clock },
              { key: 'upvotes', label: 'Most Loved', icon: Heart },
              { key: 'discussed', label: 'Most Discussed', icon: MessageSquare }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  sortBy === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas List */}
        <div className="space-y-6">
          {sortedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onExpand={setSelectedIdea}
            />
          ))}
        </div>

        {/* Modals */}
        {showNewIdeaForm && (
          <NewIdeaForm onClose={() => setShowNewIdeaForm(false)} />
        )}

        {selectedIdea && (
          <IdeaDetailsModal
            idea={selectedIdea}
            onClose={() => setSelectedIdea(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MicroForum;
