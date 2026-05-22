"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Send, Clock, Trash2, Heart, MessageCircle } from "lucide-react";
import { postService } from "@/services/user/postService";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Post {
  _id: string;
  title?: string;
  content: string;
  mediaUrls: string[];
  likes: string[];
  commentCount: number;
  createdAt: string;
}

export default function ClientPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", mediaUrls: [] as string[] });

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await postService.getMyPosts();
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to fetch your posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setIsCreating(true);
      const response = await postService.createPost(newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: "", content: "", mediaUrls: [] });
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await postService.deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Create Post Section */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" />
          Create New Post
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post title (optional)"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          <textarea
            placeholder="What's on your mind? Share your health journey..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows={4}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
          />
          <div className="flex items-center justify-between pt-2">
            <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 text-sm font-medium transition-colors">
              <ImageIcon className="w-5 h-5" />
              Add Image
            </button>
            <button
              onClick={handleCreatePost}
              disabled={isCreating || !newPost.content.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              {isCreating ? "Posting..." : "Post Now"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* My Posts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          My Posts
          <span className="text-xs font-normal text-gray-400">({posts.length})</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">You haven't posted anything yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    {post.title && <h3 className="font-bold text-gray-900">{post.title}</h3>}
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.commentCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
