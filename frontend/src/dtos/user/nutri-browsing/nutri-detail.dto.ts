import {
  QualificationDto,
  ExperienceDto,
  CertificationDto,
} from "@/dtos/nutritionist/nutritionist-application-details.dto";

import {
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "@/types/nutritionist.types";

export interface NutritionistProfileSummaryDTO {
  username: string;
  fullName: string;
  profileImage?: string;
  email: string;
}

export interface NutritionistProfileDetailsDTO {
  qualifications: QualificationDto[];
  experiences: ExperienceDto[];
  specializations: Specialization[];
  bio: string;
  languages: Language[];
  availabilityStatus: AvailabilityStatus;
  certifications: CertificationDto[];
  totalExperienceYears: number;
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
}

export interface NutritionistDetailDTO {
  user: NutritionistProfileSummaryDTO;
  profile: NutritionistProfileDetailsDTO;
}
