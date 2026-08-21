const RESOURCE_BASE = "/api/public/resources";

export const PUBLIC_RESOURCE_ROUTES = {
  LIST: RESOURCE_BASE,
  DETAILS: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}`,
  VIEW: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/view`,
  DOWNLOAD: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/download`,
  SHARE: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}/share`,
} as const;