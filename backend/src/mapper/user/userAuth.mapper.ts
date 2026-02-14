import { SafeUserDto, UserRole, GetMeResponseDto } from "../../dtos/user/userAuth.response.dto";

// Adjust this to your real User entity type from repository/model
export interface UserEntity {
  _id: unknown; // mongoose ObjectId-like
  fullName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  nutritionistStatus?: string;
}

const toStringId = (id: unknown): string => {
  // Works for ObjectId and string; safer than any
  if (typeof id === "string") return id;
  if (id && typeof (id as { toString: () => string }).toString === "function") {
    return (id as { toString: () => string }).toString();
  }
  return String(id);
};

const toUserRole = (role: string): UserRole => {
  if (role === "client" || role === "nutritionist" || role === "admin") return role;
  return "client";
};

const toNutritionistStatus = (
  status?: string
): GetMeResponseDto["nutritionistStatus"] => {
  if (status === "submitted" || status === "approved" || status === "rejected") return status;
  return "not_submitted";
};

export const mapUserToSafeUserDto = (user: UserEntity): SafeUserDto => ({
  id: toStringId(user._id),
  fullName: user.fullName,
  email: user.email,
  role: toUserRole(user.role),
  isBlocked: user.isBlocked,
});

export const mapUserToGetMeDto = (user: UserEntity): GetMeResponseDto => ({
  id: toStringId(user._id),
  fullName: user.fullName,
  email: user.email,
  role: toUserRole(user.role),
  nutritionistStatus: toNutritionistStatus(user.nutritionistStatus),
});
