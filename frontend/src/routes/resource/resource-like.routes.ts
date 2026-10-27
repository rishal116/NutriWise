const RESOURCE_BASE = "/api/resources";

export const RESOURCE_LIKE_ROUTES = {
  LIKE: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/like`,
} as const;