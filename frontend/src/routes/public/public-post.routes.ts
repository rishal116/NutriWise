const POST_BASE = "/api/public/posts";

export const PUBLIC_POST_ROUTES = {
  POSTS: POST_BASE,

  DETAILS: (postId: string) => `${POST_BASE}/${postId}`,

  BY_AUTHOR: (userId: string) => `${POST_BASE}/author/${userId}`,
} as const;
