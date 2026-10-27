const POST_BASE = "/api/posts";

export const POST_VIEW_ROUTES = {
  VIEW: (postId: string) => `${POST_BASE}/${postId}/view`,
} as const;