import type {
  ApplicationStatus,
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "@/types/nutritionist.types";
import type { Gender, UserRole } from "@/enums/user/user.enum";

export interface QualificationDto {
  degree: string;
  institution: string;
  year: number;
}

export interface ExperienceDto {
  role: string;
  organization: string;
  durationYears: number;
}

export interface CertificationDto {
  name: string;
  issuedBy: string;
  certificateUrl: string;
}

export interface AdminNutritionistDetailsDto {
  id: string;
  userId: string;

  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  gender?: Gender;

  roles: UserRole[];
  activeRole: UserRole;
  isBlocked: boolean;
  isProfileCompleted: boolean;

  qualifications: QualificationDto[];
  experiences: ExperienceDto[];
  certifications: CertificationDto[];
  specializations: Specialization[];
  languages: Language[];
  bio?: string;
  resumeUrl: string;

  availabilityStatus: AvailabilityStatus;
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  coachLevel: CoachLevel;

  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
  totalExperienceYears: number;

  createdAt: string;
  updatedAt: string;
}
