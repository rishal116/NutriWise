const POST_BASE = "/api/posts";

export const POST_COMMENT_ROUTES = {
  COMMENTS: (postId: string) => `${POST_BASE}/${postId}/comments`,
  COMMENT: (commentId: string) => `${POST_BASE}/comments/${commentId}`,
} as const;