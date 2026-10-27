const RESOURCE_BASE = "/api/resources";

export const RESOURCE_COMMENT_ROUTES = {
  COMMENTS: (resourceId: string) =>
    `${RESOURCE_BASE}/${resourceId}/comments`,
  COMMENT: (commentId: string) =>
    `${RESOURCE_BASE}/comments/${commentId}`,
} as const;