import { UserRole } from "../../models/user.model";
export class UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  constructor(user: any) {
    this.id = user._id.toString();
    this.fullName = user.fullName ?? "";
    this.email = user.email ?? "";
    this.role = user.role ?? "client";
    this.isBlocked = user.isBlocked ?? false;
  }
}

export class NutritionistStatusDTO extends UserDTO {
  nutritionistStatus: "approved" | "pending" | "rejected" | "none";
  rejectionReason?: string;
  constructor(user: any) {
    super(user);
    this.nutritionistStatus = user.nutritionistStatus ?? "none";
    this.rejectionReason = user.rejectionReason ?? "";
  }
}


import { IExperience } from "../../models/nutritionistProfile.model";
export class NutritionistProfileDTO {
  profileImage?: string;
  qualifications: string[];
  specializations: string[];
  bio?: string;
  languages: string[];
  salary: number;
  country: string;
  experiences: IExperience[];
  totalExperienceYears?: number;
  cv?: string;
  certifications?: string[];
  availabilityStatus: "available" | "unavailable" | "busy";

  constructor(profile: any) {
    this.profileImage = profile.profileImage ?? "";
    this.qualifications = profile.qualifications ?? [];
    this.specializations = profile.specializations ?? [];
    this.bio = profile.bio ?? "";
    this.languages = profile.languages ?? [];
    this.salary = profile.salary ?? 0;
    this.country = profile.country ?? "";
    this.experiences = profile.experiences ?? [];
    this.totalExperienceYears = profile.totalExperienceYears ?? 0;
    this.cv = profile.cv ?? "";
    this.certifications = profile.certifications ?? [];
    this.availabilityStatus = profile.availabilityStatus ?? "available";
  }
}


export class AdminNutritionistProfileDTO {
  user: NutritionistStatusDTO;
  profile: NutritionistProfileDTO;

  constructor(user: any, profile: any) {
    this.user = new NutritionistStatusDTO(user);
    this.profile = new NutritionistProfileDTO(profile);
  }
}