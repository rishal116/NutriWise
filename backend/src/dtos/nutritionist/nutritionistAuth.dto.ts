import { IUser } from "../../models/user.model";

export interface ExperienceDto {
  role: string;
  organization: string;
  years: number;
}

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


export interface NutritionistRejectionDto {
  fullName: string;
  email: string;
  nutritionistStatus: "pending" | "approved" | "rejected" | "none";
  rejectionReason: string;
}

export class NutritionistRejectionDTO implements NutritionistRejectionDto {
  fullName: string;
  email: string;
  nutritionistStatus: "pending" | "approved" | "rejected" | "none";
  rejectionReason: string;
  constructor(user: IUser) {
    this.fullName = user.fullName;
    this.email = user.email;
    this.nutritionistStatus = user.nutritionistStatus || "none";
    this.rejectionReason = user.rejectionReason || "";
  }
}

export class NutritionistNameDTO {
  name: string;
  email: string;
  profileImage: string;

  constructor(name: string, email: string, profileImage: string) {
    this.name = name;
    this.email = email;
    this.profileImage = profileImage;
  }
}


export interface NutritionistDetailsDTO {
  qualifications: string[];
  specializations: string[];
  experiences: {
    role: string;
    organization: string;
    years: number;
  }[];
  languages: string[];
  bio?: string;
  cvUrl?: string;
  certificationUrls?: string[];
}




