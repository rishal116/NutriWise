import { IExperience } from "../../models/nutritionistProfile.model";
import { Types } from "mongoose";

export interface NutritionistProfileDTO {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  bio: string;
  availabilityStatus: string;
  totalExperienceYears: number;
  languages: string[];
  qualifications: string[];
  specializations: string[];
  experiences: any[];
  certifications: any[];
  cv: string;
}

export interface NutritionistGeneralInfoDTO {
  _id: string;
  fullName: string;
  phone: string;
  gender: string;
  languages: string[];
  bio: string;
}
