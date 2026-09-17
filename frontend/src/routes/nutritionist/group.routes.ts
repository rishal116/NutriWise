const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_GROUP_ROUTES = {
  GROUPS: `${NUTRITIONIST_BASE}/groups`,
  GROUP_BY_ID: (groupId: string) =>
    `${NUTRITIONIST_BASE}/groups/${groupId}`,
} as const;