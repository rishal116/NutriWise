import { api } from "@/lib/axios/api";
import { API_ROUTES } from "@/routes/user.routes";

export interface CreatePostPayload {
  title?: string;
  content: string;
  mediaUrls?: string[];
}

export const postService = {
  getAllPosts: async (page: number = 1, limit: number = 10) => {
    const res = await api.get(`${API_ROUTES.POSTS.GET_ALL}?page=${page}&limit=${limit}`);
    return res.data;
  },

  getMyPosts: async (page: number = 1, limit: number = 10) => {
    const res = await api.get(`${API_ROUTES.POSTS.GET_MINE}?page=${page}&limit=${limit}`);
    return res.data;
  },

  createPost: async (payload: CreatePostPayload) => {
    const res = await api.post(API_ROUTES.POSTS.CREATE, payload);
    return res.data;
  },

  toggleLike: async (postId: string) => {
    const res = await api.post(API_ROUTES.POSTS.TOGGLE_LIKE(postId));
    return res.data;
  },

  deletePost: async (postId: string) => {
    const res = await api.delete(API_ROUTES.POSTS.DELETE(postId));
    return res.data;
  },

  getComments: async (postId: string) => {
    const res = await api.get(API_ROUTES.POSTS.GET_COMMENTS(postId));
    return res.data;
  },

  addComment: async (postId: string, content: string) => {
    const res = await api.post(API_ROUTES.COMMENTS.CREATE, { postId, content });
    return res.data;
  }
};
