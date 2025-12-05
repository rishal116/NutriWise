import { UserRole } from "../../models/user.model";

export class UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;

  constructor(user: { _id: any; fullName?: string; email?: string; role?: UserRole; isBlocked?: boolean }) {
    this.id = user._id.toString();
    this.name = user.fullName || "";
    this.email = user.email || "";
    this.role = user.role || "client";
    this.isBlocked = user.isBlocked || false;
  }
}

export class NutritionistDTO extends UserDTO {
  nutritionistStatus: "approved" | "pending" | "rejected"|"none";

  constructor(user: {
    _id: any;
    fullName?: string;
    email?: string;
    role?: UserRole;
    isBlocked?: boolean;
    nutritionistStatus?: "approved" | "pending" | "rejected"|"none";
  }) {
    super(user); // sets id, name, email, role, isBlocked
    this.nutritionistStatus = user.nutritionistStatus || "pending";
  }
}

import { IExperience } from "../../models/nutritionistDetails.model";

export interface AdminNutritionistProfileDto {
  _id: string;                     // From User
  fullName: string;                // From User
  email: string;                   // From User
  phone?: string;                  // From User
  profileImage?: string;           // From User or NutritionistDetails
  nutritionistStatus: "pending" | "approved" | "rejected" | "none"; // User
  rejectionReason?: string;        // User

  // NutritionistDetails
  qualifications: string[];
  specializations: string[];
  bio?: string;
  languages: string[];
  videoCallRate: number;
  consultationDuration: string;
  location?: {
    state: string;
    city: string;
  };
  experiences: IExperience[];
  totalExperienceYears?: number;
  cv?: string;
  certifications?: string[];
  availabilityStatus: "available" | "unavailable" | "busy";
  createdAt: Date;
  updatedAt: Date;
}
