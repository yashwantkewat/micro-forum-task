import { create } from 'zustand';

export const useForumStore = create((set, get) => ({
ideas: [
  {
    id: 1,
    title: "Implement AI-powered code reviews",
    content: "We should integrate AI tools to automatically review pull requests and suggest improvements, reducing manual review time.",
    author: "Sarah Chen",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
