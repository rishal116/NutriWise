"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Clock, Send, Loader2, Sparkles } from "lucide-react";
import { postService } from "@/services/user/postService";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  _id: string;
  authorId: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  authorId: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  title?: string;
  content: string;
  mediaUrls: string[];
  likes: string[];
  commentCount: number;
  createdAt: string;
}

export default function CommunitiesPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await postService.toggleLike(postId);
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(user?._id || "");
          const newLikes = isLiked 
            ? post.likes.filter(id => id !== user?._id)
            : [...post.likes, user?._id || ""];
          return { ...post, likes: newLikes };
        }
        return post;
      }));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const toggleComments = async (postId: string) => {
    if (!showComments[postId]) {
      try {
        const response = await postService.getComments(postId);
        setComments(prev => ({ ...prev, [postId]: response.data }));
      } catch (error) {
        toast.error("Failed to fetch comments");
      }
    }
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      const response = await postService.addComment(postId, text);
      setComments(prev => ({
        ...prev,
        [postId]: [response.data, ...(prev[postId] || [])]
      }));
      setCommentText(prev => ({ ...prev, [postId]: "" }));
      setPosts(prev => prev.map(p => 
        p._id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      ));
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-lg font-medium">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
          <p className="text-gray-500 mt-1">Stay updated with the latest from your nutrition circles.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          Latest Activity
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layout className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No posts yet</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">Be the first one to share your progress or ask a question!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Post Header */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center overflow-hidden shadow-inner">
                        {post.authorId.profileImage ? (
                          <img src={post.authorId.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-none">{post.authorId.fullName}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  {post.title && <h2 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{post.title}</h2>}
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Media */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group relative">
                      <img src={post.mediaUrls[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center gap-8">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-all duration-200 hover:scale-110 ${
                      post.likes.includes(user?._id || "") ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.likes.includes(user?._id || "") ? "fill-current" : ""}`} />
                    {post.likes.length}
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-all duration-200 hover:scale-110"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {post.commentCount}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-all duration-200 ml-auto">
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Comment Section */}
                <AnimatePresence>
                  {showComments[post._id] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-100 bg-white"
                    >
                      <div className="p-6 space-y-6">
                        {/* Comment Input */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Add to the conversation..."
                              value={commentText[post._id] || ""}
                              onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                              className="w-full bg-gray-50 border border-transparent rounded-2xl py-2.5 px-5 pr-12 text-sm focus:outline-none focus:bg-white focus:border-emerald-200 transition-all"
                            />
                            <button 
                              onClick={() => handleAddComment(post._id)}
                              disabled={!commentText[post._id]?.trim()}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-xl disabled:opacity-30 transition-all"
                            >
                              <Send className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-5">
                          {comments[post._id]?.map((comment) => (
                            <div key={comment._id} className="flex gap-4">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {comment.authorId.profileImage ? (
                                  <img src={comment.authorId.profileImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-5 h-5 text-emerald-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none group relative">
                                  <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-bold text-gray-900">{comment.authorId.fullName}</span>
                                    <span className="text-[10px] font-medium text-gray-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}