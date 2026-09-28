import { Types } from "mongoose";

import {
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "../../nutritionist.types";

import {
  ICertification,
  IExperience,
  IQualification,
} from "../../../models/nutritionistProfile.model";

export interface NutritionistDetailUser {
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  profileImage?: string;
  email: string;
}

export interface NutritionistDetailProfile {
  _id: Types.ObjectId;
  qualifications: IQualification[];
  specializations: Specialization[];
  experiences: IExperience[];
  bio?: string;
  languages: Language[];
  availabilityStatus: AvailabilityStatus;
  resumeUrl: string;
  certifications: ICertification[];
  totalExperienceYears: number;
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
  createdAt: Date;
}

export interface NutritionistDetailResult {
  user: NutritionistDetailUser;
  profile: NutritionistDetailProfile;
}

export interface NutritionistBrowseStatsResult {
  totalNutritionists: number;
  averageRating: number;
  totalReviews: number;
  totalPeopleCoached: number;
}