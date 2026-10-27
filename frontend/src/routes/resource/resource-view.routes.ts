const RESOURCE_BASE = "/api/resources";

export const RESOURCE_VIEW_ROUTES = {
  VIEW: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/view`,
} as const;