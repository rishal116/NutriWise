import { IUser } from "../../models/user.model";
import { INutritionistProfile } from "../../models/nutritionistProfile.model";
import { IPlan } from "../../models/nutritionistPlan.model";

export class NutritionistUserSideDTO {
  id: string;
  fullName: string;
  profileImage?: string;
  rating?: number;
  totalPeopleCoached?: number;
  specializations: string[];

  constructor(user: IUser, profile: INutritionistProfile) {
    this.id = user._id.toString();
    this.fullName = user.fullName;
    this.profileImage = user.profileImage;
    this.rating = profile.rating;
    this.totalPeopleCoached = profile.totalPeopleCoached;
    this.specializations = profile.specializations;
  }
}


export interface NutritionistListFilter {
  page: number;
  limit: number;
  search?: string;
  specializations?: string;
}

export interface NutritionistRepoResult {
  data: {
    user: IUser;
    profile: INutritionistProfile;
  }[];
  total: number;
}




export interface NutritionistUserDto {
  id: string;
  fullName: string;
  email: string;
  specializations: string[];
  rating: number;
  bio?: string;
  totalExperienceYears?: number;
  profileImage?: string;
  languages?: string[];
  qualifications?: string[];
  experiences?: { role: string; organization: string; years: number }[];
  availabilityStatus?: "available" | "unavailable" | "busy";
  certifications?: string[];
  
  totalPeopleCoached?: number;
  nutritionistStatus?: "BEGINNER" | "VERIFIED" | "EXPERT" | "TOP_COACH";
}

export class NutritionistUserDTO implements NutritionistUserDto {
  id: string;
  fullName: string;
  email: string;
  specializations: string[];
  rating: number;
  bio?: string;
  totalExperienceYears?: number;
  profileImage?: string;
  languages?: string[];
  qualifications?: string[];
  experiences?: { role: string; organization: string; years: number }[];
  availabilityStatus?: "available" | "unavailable" | "busy";
  certifications?: string[];
  
  totalPeopleCoached?: number;
  nutritionistStatus?: "BEGINNER" | "VERIFIED" | "EXPERT" | "TOP_COACH";

  constructor(user: IUser, profile?: INutritionistProfile) {
    this.id = user._id.toString();
    this.fullName = user.fullName ?? "";
    this.email = user.email;
    this.specializations = profile?.specializations ?? [];
    this.rating = profile?.rating ?? 0;
    this.bio = profile?.bio ?? "";
    this.totalExperienceYears = profile?.totalExperienceYears ?? 0;
     this.profileImage = user.profileImage;
    this.languages = profile?.languages ?? [];
    this.qualifications = profile?.qualifications ?? [];
    this.experiences = profile?.experiences ?? [];
    this.availabilityStatus = profile?.availabilityStatus;
    this.certifications = profile?.certifications ?? [];
    
    // NEW FIELDS
    this.totalPeopleCoached = profile?.totalPeopleCoached ?? 0;
    this.nutritionistStatus = profile?.coachLevel ?? "BEGINNER";
  }
}


export interface NutritionistPlanDTO {
  id: string;
  nutritionistId: string;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  description: string;
  features: string[];
  tags: string[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}