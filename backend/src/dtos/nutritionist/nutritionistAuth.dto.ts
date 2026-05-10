import { INutritionistProfile } from "../../models/nutritionistProfile.model";
import { IUser } from "../../models/user.model";

// ─────────────────────────────────────────────
// Shared Types
// ─────────────────────────────────────────────

export type NutritionistStatus = "none" | "pending" | "approved" | "rejected";

// ─────────────────────────────────────────────
// Experience DTO
// ─────────────────────────────────────────────

export interface ExperienceDto {
  role: string;
  organization: string;
  years: number;
}

// ─────────────────────────────────────────────
// Nutritionist Application / Update DTO
// Used when client applies or reapplies
// ─────────────────────────────────────────────

export interface NutritionistDetailsUpdateDto {
  qualifications: string[];
  specializations: string[];
  experiences: ExperienceDto[];
  bio: string;
  languages: string[];
  cv?: string;
  certifications?: string[];
  totalExperienceYears: number;
}

// ─────────────────────────────────────────────
// User Nutritionist Status DTO
// Used for pending / rejected / approved checks
// ─────────────────────────────────────────────

export interface NutritionistStatusDto {
  fullName: string;
  email: string;
  roles: string[];
  activeRole: string;
  nutritionistStatus: NutritionistStatus;
  rejectionReason: string;
}

// ─────────────────────────────────────────────
// Rejection DTO
// ─────────────────────────────────────────────

export class NutritionistRejectionDTO {
  fullName: string;
  email: string;
  nutritionistStatus: NutritionistStatus;
  rejectionReason: string;

  constructor(
    user: IUser,
    nutritionistProfile?: INutritionistProfile
  ) {
    this.fullName = user.fullName;
    this.email = user.email;
    this.nutritionistStatus =
      nutritionistProfile?.verificationStatus || "none";
    this.rejectionReason =
      nutritionistProfile?.rejectionReason || "";
  }
}

// ─────────────────────────────────────────────
// Public Nutritionist Profile DTO
// Used in listings/search
// ─────────────────────────────────────────────

export class NutritionistNameDTO {
  fullName: string;
  email: string;
  profileImage: string;

  constructor(fullName: string, email: string, profileImage: string) {
    this.fullName = fullName;
    this.email = email;
    this.profileImage = profileImage;
  }
}

// ─────────────────────────────────────────────
// Full Nutritionist Details DTO
// Used for details page / edit / reapply
// ─────────────────────────────────────────────

export interface NutritionistDetailsDTO {
  qualifications: string[];
  specializations: string[];

  experiences: ExperienceDto[];

  languages: string[];

  bio?: string;

  cvUrl?: string;

  certificationUrls?: string[];

  totalExperienceYears?: number;
}

// ─────────────────────────────────────────────
// Admin Approval DTO (Optional Future Use)
// ─────────────────────────────────────────────

export interface NutritionistApprovalDTO {
  userId: string;
  approvedBy: string;
  nutritionistStatus: "approved";
  approvedAt: Date;
}

// ─────────────────────────────────────────────
// Admin Rejection DTO (Optional Future Use)
// ─────────────────────────────────────────────

export interface NutritionistAdminRejectionDTO {
  userId: string;
  rejectedBy: string;
  nutritionistStatus: "rejected";
  rejectionReason: string;
  rejectedAt: Date;
}
