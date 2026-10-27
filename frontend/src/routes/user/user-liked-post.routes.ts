const USER_BASE = "/api/users";

export const USER_LIKED_POST_ROUTES = {
  LIST: `${USER_BASE}/liked-posts`,
  DETAILS: (postId: string) => `${USER_BASE}/liked-posts/${postId}`,
} as const;