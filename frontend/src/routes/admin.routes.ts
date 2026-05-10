export const AdminRoutes = {
  // Auth
  LOGIN: "/admin/login",
  FORGOT_PASSWORD: "/admin/forgot-password",
  LOGOUT: "/admin/logout",

  // Dashboard
  DASHBOARD: "/admin/dashboard",

  // Nutritionist management
  NUTRITIONISTS: "/admin/nutritionists",
  NUTRITIONIST_APPLICATIONS: "/admin/nutritionists/applications",
  NUTRITIONIST_PROFILE: "/admin/nutritionists/:userId",

  NUTRITIONIST_APPROVE: "/admin/nutritionists/:userId/approve",
  NUTRITIONIST_REJECT: "/admin/nutritionists/:userId/reject",
  NUTRITIONIST_LEVEL: "/admin/nutritionists/:userId/level",

  // Users
  USERS: "/admin/users",
  BLOCK_USER: "/admin/users/block/:userId",
  UNBLOCK_USER: "/admin/users/unblock/:userId",

  // Profile
  PROFILE: "/admin/profile",
};