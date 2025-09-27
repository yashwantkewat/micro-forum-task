import React, { useEffect, useState } from "react";
import { useIdeaStore } from "../store/ideaStore";
import { MessageSquare, Heart, TrendingUp, Plus, Send, User, Clock, Eye } from "lucide-react";
import IdeaCard from "../components/IdeaCard";
import IdeaForm from "../components/IdeaForm";
import IdeaDetailsModal from "../components/IdeaDetailsModal";

const MicroForum = () => {
  const { ideas, fetchIdeas, currentUser } = useIdeaStore();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [sortBy, setSortBy] = useState("trending");

  // Fetch ideas from backend on mount
  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // Sort ideas based on criteria
  const sortedIdeas = React.useMemo(() => {
    const ideaList = [...ideas];

    switch (sortBy) {
      case "trending":
        return ideaList.sort((a, b) => {
          const scoreA = (a.comments?.length || 0) * 2 + (a.upvotes || 0) + Math.floor((a.views || 0) / 5);
          const scoreB = (b.comments?.length || 0) * 2 + (b.upvotes || 0) + Math.floor((b.views || 0) / 5);
          return scoreB - scoreA;
        });
      case "recent":
        return ideaList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case "upvotes":
        return ideaList.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      case "discussed":
        return ideaList.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
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

        {/* Sort Options */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "trending", label: "Trending", icon: TrendingUp },
            { key: "recent", label: "Recent", icon: Clock },
            { key: "upvotes", label: "Most Loved", icon: Heart },
            { key: "discussed", label: "Most Discussed", icon: MessageSquare },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                sortBy === key ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Ideas List */}
        <div className="space-y-6">
          {sortedIdeas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} onExpand={setSelectedIdea} />
          ))}
        </div>

        {/* Modals */}
        {showNewIdeaForm && <IdeaForm onClose={() => setShowNewIdeaForm(false)} />}
        {selectedIdea && <IdeaDetailsModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />}
      </div>
    </div>
  );
};

export default MicroForum;
