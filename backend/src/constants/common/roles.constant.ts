export const ROLES = {
  CLIENT: "client",
  NUTRITIONIST: "nutritionist",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: Role[] = [
  ROLES.CLIENT,
  ROLES.NUTRITIONIST,
  ROLES.ADMIN,
] as const;