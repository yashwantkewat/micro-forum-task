import React, { useState, useMemo } from 'react';
import IdeaCard from './IdeaCard';
import IdeaDetailsModal from './IdeaDetailsModal';
import NewIdeaForm from './NewIdeaForm';
import ForumStats from './ForumStats';
import SortOptions from './SortOptions';
import { Plus } from 'lucide-react';
import { useForumStore } from '../store/forumStore';

const MicroForum = () => {
  const { ideas } = useForumStore();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [sortBy, setSortBy] = useState('trending');

  const sortedIdeas = useMemo(() => {
    const ideaList = [...ideas];
    switch (sortBy) {
      case 'trending':
        return ideaList.sort((a, b) => 
          b.comments.length * 2 + b.upvotes + Math.floor(b.views / 5) - 
          (a.comments.length * 2 + a.upvotes + Math.floor(a.views / 5))
        );
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
        <div className="mb-8 flex items-center justify-between">
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

        <ForumStats ideas={ideas} />
        <SortOptions sortBy={sortBy} setSortBy={setSortBy} />

        {/* Ideas List */}
        <div className="space-y-6">
          {sortedIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onExpand={setSelectedIdea} />
          ))}
        </div>

        {/* Modals */}
        {showNewIdeaForm && <NewIdeaForm onClose={() => setShowNewIdeaForm(false)} />}
        {selectedIdea && <IdeaDetailsModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />}
      </div>
    </div>
  );
};

export default MicroForum;
