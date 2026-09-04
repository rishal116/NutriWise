const RESOURCE_BASE = "/api/public/resources";

export const PUBLIC_RESOURCE_ROUTES = {
  LIST: RESOURCE_BASE,

  DETAILS: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}`,

  VIEW: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/view`,

  DOWNLOAD: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/download`,

  LIKE: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/like`,

  UNLIKE: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/like`,

  BOOKMARK: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/bookmark`,

  UNBOOKMARK: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/bookmark`,

  COMMENTS: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/comments`,

  DELETE_COMMENT: (commentId: string) =>
    `${RESOURCE_BASE}/comments/${commentId}`,
} as const;
