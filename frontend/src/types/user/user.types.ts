export type UserRole = "user" | "nutritionist" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  profileImage: string | null;
  activeRole: UserRole;
  roles: UserRole[];
  isProfileCompleted: boolean;
  nutritionistStatus: "pending" | "approved" | "rejected" | null;
}
