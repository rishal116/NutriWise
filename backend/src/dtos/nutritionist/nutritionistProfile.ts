import { IExperience } from "../../models/nutritionistDetails.model";

export interface NutritionistProfileDto {
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
