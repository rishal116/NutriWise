export const ROLES = ["client", "nutritionist", "admin"] as const;
export type Role = (typeof ROLES)[number];

