import { SafeUserDto, UserRole, GetMeResponseDto } from "../../dtos/user/userAuth.response.dto";

export interface UserEntity {
  _id: unknown;
  fullName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  nutritionistStatus?: string;
}

const toStringId = (id: unknown): string => {
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
  if (status === "none" || status === "rejected" || status === "approved" || status === "pending") return status;
  return "none";
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
