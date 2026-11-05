export const ROLES = {
  USER: "user",
  NUTRITIONIST: "nutritionist",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: Role[] = [
  ROLES.USER,
  ROLES.NUTRITIONIST,
  ROLES.ADMIN,
];
