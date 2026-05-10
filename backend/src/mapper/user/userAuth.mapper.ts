import {
  SafeUserDto,
  UserRole,
  NutritionistStatus,
  GetMeResponseDto,
} from "../../dtos/user/userAuth.response.dto";

// ==========================================
// User Entity Interface
// ==========================================
export interface UserEntity {
  _id: unknown;

  fullName: string;
  email: string;

  roles?: string[];
  activeRole?: string;
  googleProviderId?: string;
  
  profileImageUrl?: string;

  isBlocked: boolean;

  nutritionistStatus?: string;
}

// ==========================================
// Convert ObjectId to String
// ==========================================
const toStringId = (id: unknown): string => {
  if (typeof id === "string") return id;

  if (
    id &&
    typeof (id as { toString: () => string }).toString === "function"
  ) {
    return (id as { toString: () => string }).toString();
  }

  return String(id);
};

// ==========================================
// Validate Single Role
// ==========================================
const toUserRole = (role?: string): UserRole => {
  if (
    role === "client" ||
    role === "nutritionist" ||
    role === "admin"
  ) {
    return role;
  }

  return "client";
};

// ==========================================
// Validate Roles Array
// ==========================================
const toUserRoles = (roles?: string[]): UserRole[] => {
  if (!roles || roles.length === 0) return ["client"];

  return roles
    .map((role) => toUserRole(role))
    .filter(
      (role, index, self) => self.indexOf(role) === index
    );
};

// ==========================================
// Validate Nutritionist Status
// ==========================================
const toNutritionistStatus = (
  status?: string
): NutritionistStatus => {
  if (
    status === "none" ||
    status === "pending" ||
    status === "approved" ||
    status === "rejected"
  ) {
    return status;
  }

  return "none";
};

// ==========================================
// Safe User Mapper
// ==========================================
export const mapUserToSafeUserDto = (
  user: UserEntity
): SafeUserDto => ({
  id: toStringId(user._id),

  fullName: user.fullName,
  email: user.email,

  roles: toUserRoles(user.roles),
  activeRole: toUserRole(user.activeRole),

  profileImageUrl: user.profileImageUrl || "",

  isBlocked: user.isBlocked,

  nutritionistStatus: toNutritionistStatus(
   user.nutritionistStatus || "none",
  ),
});

// ==========================================
// GetMe Mapper
// ==========================================
export const mapUserToGetMeDto = (
  user: UserEntity
): GetMeResponseDto => ({
  success: true,

  user: mapUserToSafeUserDto(user),
});