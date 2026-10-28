const ADMIN_BASE = "/api/admin";

export const ADMIN_POST_ROUTES = {
  LIST: `${ADMIN_BASE}/posts`,
  DELETE: (postId: string) => `${ADMIN_BASE}/posts/${postId}`,
} as const;