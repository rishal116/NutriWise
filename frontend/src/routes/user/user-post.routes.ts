const USER_BASE = "/api/users";

export const USER_POST_ROUTES = {
  CREATE: `${USER_BASE}/posts`,
  LIST: `${USER_BASE}/posts`,
  DETAILS: (postId: string) => `${USER_BASE}/posts/${postId}`,
  UPDATE: (postId: string) => `${USER_BASE}/posts/${postId}`,
  DELETE: (postId: string) => `${USER_BASE}/posts/${postId}`,
} as const;
