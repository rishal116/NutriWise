

import { Language } from "../../../constants/nutritionist/profile/language.constants";
import { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";
import {
  ICertification,
  IExperience,
  IQualification,
} from "../../../models/nutritionistProfile.model";
import { AvailabilityStatus, CoachLevel } from "../../../types/nutritionist.types";

export interface NutritionistUserDTO {
  id:string;
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
