const POST_BASE = "/api/posts";

export const POST_LIKE_ROUTES = {
  LIKE: (postId: string) => `${POST_BASE}/${postId}/like`,
} as const;