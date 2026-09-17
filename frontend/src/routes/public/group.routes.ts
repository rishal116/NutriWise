const GROUP_BASE = "/api/public/groups";

export const PUBLIC_GROUP_ROUTES = {
  GROUPS: GROUP_BASE,

  DETAILS: (groupId: string) => `${GROUP_BASE}/${groupId}`,

  JOIN: (groupId: string) => `${GROUP_BASE}/${groupId}/join`,
} as const;
