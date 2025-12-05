import { IExperience } from "../../models/nutritionistDetails.model";
import { Types } from "mongoose";

export interface NutritionistProfileDTO {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  bio: string;
  availabilityStatus: string;
  consultationDuration: string;
  videoCallRate: number;
  totalExperienceYears: number;
  languages: string[];
  qualifications: string[];
  specializations: string[];
  experiences: any[];
  certifications: any[];
  location: {
    state: string;
    city: string;
  };
  cv: string;
}
