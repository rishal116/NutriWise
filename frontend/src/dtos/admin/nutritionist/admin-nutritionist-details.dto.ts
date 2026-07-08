import {
  ApplicationStatus,
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "@/types/nutritionist.types";
import { Gender, UserRole } from "@/enums/user/userRole.enum";

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
  // User
  _id: string;
  userId: string;

  fullName: string;
  email: string;
  username: string;

  profileImage?: string;

  phone?: string;

  birthDate?: Date;

  gender?: Gender;

  roles: UserRole[];

  activeRole: UserRole;

  isBlocked: boolean;

  isProfileCompleted: boolean;

  lastLoginAt?: Date;

  lastActiveAt?: Date;

  // Nutritionist Profile
  qualifications: QualificationDto[];

  experiences: ExperienceDto[];

  certifications: CertificationDto[];

  specializations: Specialization[];

  languages: Language[];

  bio?: string;

  resumeUrl: string;

  totalExperienceYears: number;

  availabilityStatus: AvailabilityStatus;

  applicationStatus: ApplicationStatus;

  rejectionReason?: string;

  coachLevel: CoachLevel;

  rating: number;

  totalReviews: number;

  totalPeopleCoached: number;

  createdAt: Date;

  updatedAt: Date;
}


