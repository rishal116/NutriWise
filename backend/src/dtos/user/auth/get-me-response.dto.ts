import { UserRole } from "../../../enums/user.enum";

export interface GetMeResponseDto {
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
