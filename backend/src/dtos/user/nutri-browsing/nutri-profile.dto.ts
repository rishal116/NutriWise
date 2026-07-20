import {
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "../../../types/nutritionist.types";

import {
  ICertification,
  IExperience,
  IQualification,
} from "../../../models/nutritionistProfile.model";

export interface NutritionistUserDTO {
  username: string;
  fullName: string;
  profileImage?: string;
}

export interface NutritionistProfileDTO {
  bio?: string;

  specializations: Specialization[];

  languages: Language[];

  qualifications: IQualification[];

  experiences: IExperience[];

  certifications: ICertification[];

  coachLevel: CoachLevel;

  availabilityStatus: AvailabilityStatus;

  totalExperienceYears: number;

  rating: number;

  totalReviews: number;

  totalPeopleCoached: number;
}

export interface NutritionistDetailDTO {
  user: NutritionistUserDTO;

  profile: NutritionistProfileDTO;
}
