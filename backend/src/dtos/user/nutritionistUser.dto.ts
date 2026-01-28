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
    this.profileImage = profile.profileImage;
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
  country?: string;
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
  country?: string;
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
    this.profileImage = profile?.profileImage ?? "";
    this.languages = profile?.languages ?? [];
    this.qualifications = profile?.qualifications ?? [];
    this.experiences = profile?.experiences ?? [];
    this.availabilityStatus = profile?.availabilityStatus;
    this.certifications = profile?.certifications ?? [];
    this.country = profile?.country ?? "";
    
    // NEW FIELDS
    this.totalPeopleCoached = profile?.totalPeopleCoached ?? 0;
    this.nutritionistStatus = profile?.nutritionistStatus ?? "BEGINNER";
  }
}


export class NutritionistPlanDTO {
  id: string;
  title: string;
  description: string;
  durationInDays: number;
  category:string;
  price: number;
  currency: string;
  features: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(plan: IPlan) {
    this.id = plan._id.toString();
    this.title = plan.title;
    this.description = plan.description;
    this.durationInDays = plan.durationInDays;
    this.price = plan.price;
    this.price = plan.price;
    this.category = plan.category;
    this.currency = plan.currency;
    this.features = plan.features;
    this.status = plan.status;
    this.createdAt = plan.createdAt;
    this.updatedAt = plan.updatedAt;
  }
}
